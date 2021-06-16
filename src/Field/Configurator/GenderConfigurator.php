<?php

namespace Base\Field\Configurator;
use Base\Field\GenderField;

use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldConfiguratorInterface;
use EasyCorp\Bundle\EasyAdminBundle\Dto\EntityDto;
use EasyCorp\Bundle\EasyAdminBundle\Dto\FieldDto;
use Symfony\Component\Asset\Packages;

final class GenderConfigurator implements FieldConfiguratorInterface
{
    private $assetPackages;

    public function __construct(Packages $assetPackages)
    {
        $this->assetPackages = $assetPackages;
    }

    public function supports(FieldDto $field, EntityDto $entityDto): bool
    {
        return GenderField::class === $field->getFieldFqcn();
    }

    public function configure(FieldDto $field, EntityDto $entityDto, AdminContext $context): void
    {
        if(!$field->getValue()) return;

        $formattedValue = [];
        if( !is_array($field->getValue()) ) $formattedValue = GenderField::getFormattedValue($field->getValue());
        else {
            foreach($field->getValue() as $key => $value)
                $formattedValue[$key] = GenderField::getFormattedValue($value);
        }

        $field->setFormattedValue($formattedValue);
    }

}
