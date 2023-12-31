<?php

namespace Base\Field;

use Base\Field\Type\CurrencyType;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldInterface;

class CurrencyField extends SelectField implements FieldInterface
{
    public static function new(string $propertyName, ?string $label = null): self
    {
        return (new self())
            ->setProperty($propertyName)
            ->setLabel($label)
            ->setTemplateName('crud/field/text')
            ->setFormType(CurrencyType::class)
            ->setTemplatePath('@EasyAdmin/crud/field/currency.html.twig');
    }
}
