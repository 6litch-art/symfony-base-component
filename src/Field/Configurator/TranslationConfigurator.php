<?php

namespace Base\Field\Configurator;

use Base\Database\Factory\ClassMetadataManipulator;
use Base\Service\BaseService;
use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldConfiguratorInterface;
use EasyCorp\Bundle\EasyAdminBundle\Dto\EntityDto;
use EasyCorp\Bundle\EasyAdminBundle\Dto\FieldDto;
use Base\Field\TranslationField;
use Base\Service\LocaleProvider;
use Base\Service\LocaleProviderInterface;
use Doctrine\ORM\PersistentCollection;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

final class TranslationConfigurator implements FieldConfiguratorInterface
{
    public function __construct(ClassMetadataManipulator $classMetadataManipulator, LocaleProviderInterface $localeProvider)
    {
        $this->classMetadataManipulator = $classMetadataManipulator;
        $this->localeProvider = $localeProvider;
    }
    public function supports(FieldDto $field, EntityDto $entityDto): bool
    {
        return TranslationField::class === $field->getFieldFqcn();
    }

    public function configure(FieldDto $field, EntityDto $entityDto, AdminContext $context): void
    {
        $required = $field->getCustomOption("required");
        $field->setFormTypeOption("required", $required);

        // Show formatted value
        if( ($fieldName = $field->getCustomOption("show_field")) ) {
            
            $translationEntity = $entityDto->getPropertyMetadata("translations")->get("targetEntity");
            $translationClassMetadata = $this->classMetadataManipulator->getClassMetadata($translationEntity);
            if(!$translationClassMetadata->hasField($fieldName)) 
                throw new \Exception("Field \"$fieldName\" not found in \"".$translationClassMetadata->getName()."\".");
            
            $field->setLabel(ucfirst($fieldName));
            $field->setFormattedValue("-");

            $childField = $field->getValue();
            if($childField instanceof PersistentCollection) {

                $classMetadata = $childField->getTypeClass();
                if ($classMetadata->hasField($fieldName)) {

                    $entity = $childField->get($this->localeProvider->getLocale());
                    if (!$entity) $entity = $childField->get($this->localeProvider->getDefaultLocale());

                    $formattedValue = ($entity ? $childField->getTypeClass()->getFieldValue($entity, $fieldName) : null);
                    $field->setFormattedValue($formattedValue);
                }
            }
        }
    }
}