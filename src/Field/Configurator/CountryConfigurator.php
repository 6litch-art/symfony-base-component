<?php

namespace Base\Field\Configurator;
use Base\Field\CountryField;

use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Option\TextAlign;
use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldConfiguratorInterface;
use EasyCorp\Bundle\EasyAdminBundle\Dto\EntityDto;
use EasyCorp\Bundle\EasyAdminBundle\Dto\FieldDto;

use Symfony\Contracts\Translation\TranslatorInterface;
use Base\Type\CountryType;

use Symfony\Component\Asset\Packages;
use Symfony\Component\Intl\Countries;
use Symfony\Component\Intl\Exception\MissingResourceException;

final class CountryConfigurator implements FieldConfiguratorInterface
{
    private $assetPackages;

    public function __construct(Packages $assetPackages, TranslatorInterface $translator)
    {
        $this->assetPackages = $assetPackages;
        $this->translator = $translator;
    }

    public function supports(FieldDto $field, EntityDto $entityDto): bool
    {
        return CountryField::class === $field->getFieldFqcn();
    }

    public function configure(FieldDto $field, EntityDto $entityDto, AdminContext $context): void
    {
        $countryCode = $field->getValue();

        $field->setFormattedValue(($countryCode) ? CountryType::getName($countryCode) :
            $this->translator->trans('label.form.empty_value', [], 'EasyAdminBundle'));
    }
}
