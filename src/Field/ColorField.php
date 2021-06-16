<?php

namespace Base\Field;
use EasyCorp\Bundle\EasyAdminBundle\Field\FieldTrait;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldInterface;

use Base\Field\Type\ColorType;
use EasyCorp\Bundle\EasyAdminBundle\Config\Option\TextAlign;

final class ColorField implements FieldInterface
{
    use FieldTrait;

    public static function new(string $propertyName, ?string $label = null): self
    {
        return (new self())
            ->setTextAlign(TextAlign::CENTER)
            ->setProperty($propertyName)
            ->setLabel($label)
            ->setTemplateName('crud/field/text')
            ->setTemplatePath('@Base/crud/field/color.html.twig')
            ->setFormType(ColorType::class);
    }
}
