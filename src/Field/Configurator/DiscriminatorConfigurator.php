<?php

namespace Base\Field\Configurator;

use Base\Controller\Dashboard\AbstractCrudController;
use Base\Database\Factory\ClassMetadataManipulator;
use Base\Field\DiscriminatorField;
use Base\Field\SelectField;
use Base\Field\Type\DiscriminatorType;
use Base\Field\Type\SelectType;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldConfiguratorInterface;
use EasyCorp\Bundle\EasyAdminBundle\Dto\EntityDto;
use EasyCorp\Bundle\EasyAdminBundle\Dto\FieldDto;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Exception;
use Symfony\Contracts\Translation\TranslatorInterface;

class DiscriminatorConfigurator implements FieldConfiguratorInterface
{
    public function __construct(ClassMetadataManipulator $classMetadataManipulator, TranslatorInterface $translator, AdminUrlGenerator $adminUrlGenerator)
    {
        $this->translator = $translator;
        $this->adminUrlGenerator = $adminUrlGenerator;
        $this->classMetadataManipulator = $classMetadataManipulator;
    }

    public function supports(FieldDto $field, EntityDto $entityDto): bool
    {
        return DiscriminatorField::class === $field->getFieldFqcn();
    }

    public function configure(FieldDto $field, EntityDto $entityDto, AdminContext $context): void
    {
        $showColumn = $field->getCustomOption(DiscriminatorField::OPTION_SHOW_COLUMN);
        $showInline = $field->getCustomOption(DiscriminatorField::OPTION_SHOW_INLINE);

        $discriminatorAutoload = $field->getCustomOption(DiscriminatorField::OPTION_DISCRIMINATOR_AUTOLOAD);
        if($discriminatorAutoload)
            $field->setFormType(DiscriminatorType::class);

        $defaultClass = get_class($entityDto->getInstance());
        if($showColumn)
            $field->setLabel(ucfirst($this->classMetadataManipulator->getDiscriminatorColumn($defaultClass)));

        $discriminatorMap    = $this->classMetadataManipulator->getDiscriminatorMap($defaultClass);
        $discriminatorValue  = $this->classMetadataManipulator->getDiscriminatorValue($defaultClass);
        $classCrudController = AbstractCrudController::getCrudControllerFqcn($defaultClass);

        $field->setValue($discriminatorValue);

        $formattedValues = [];
        $array   = explode("_", $field->getValue());
        foreach($array as $key => $value) {

            $value = implode("_", array_slice($array, 0, $key+1));
            $text  = implode(".", array_slice($array, 0, $key+1));

            $class = $discriminatorMap[$value] ?? null;
            if($key == array_key_last($array))
                $class = $class ?? $defaultClass;

            if ($class) {

                $class = str_replace(["App\\", "Base\\Entity\\"], ["Base\\", ""], $class);
                $text  = implode(".", array_map("camel_to_snake", explode("\\", $class)));
            }

            $formattedValues[] = DiscriminatorType::getFormattedValues($text, $discriminatorMap[$value] ?? $defaultClass, $this->translator);
        }
        
        if($showInline) {

            $lastEntry = end($formattedValues);
            $label = array_map(fn($v) => $v["text"], $formattedValues);
            $lastEntry["text"] = implode(" > ", $label);
            $formattedValues = [$lastEntry];
        }

        if (!empty($formattedValues) && $classCrudController)
            $formattedValues[count($formattedValues)-1]["url"] = $this->adminUrlGenerator->unsetAll()->setController($classCrudController)->setAction(Action::INDEX)->set("filters[".$field->getProperty()."][value]", $discriminatorValue)->generateUrl();

        $field->setValue(array_key_transforms(fn($k,$v):array => [$k, $v["id"] ?? null], $formattedValues));
        $field->setFormattedValue($formattedValues);
    }
}