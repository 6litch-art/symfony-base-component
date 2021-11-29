<?php

namespace Base\Field;

use Base\Field\Type\TranslatableType;
use Base\Service\LocaleProvider;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldInterface;
use EasyCorp\Bundle\EasyAdminBundle\Field\FieldTrait;

class TranslatableField implements FieldInterface
{
    use FieldTrait;

    public static function new(string $propertyName = null, ?string $label = null): self
    {
        $field = (new self())
            ->setProperty("translations")
            ->hideOnIndex()
            ->setTemplateName('crud/field/text')
            ->setTemplatePath('@EasyAdmin/crud/field/translatable.html.twig')
            ->setCustomOption("required", true)
            ->setFormType(TranslatableType::class);

        if($propertyName)
            $field->setFields([$propertyName => []])->showOnIndex($propertyName);

        return $field;
    }

    public function setFields(array $fields): self
    {
        $this->setFormTypeOption("fields", $fields);
        return $this;
    }

    public function showOnIndex(?string $field): self
    {
        if($field) {

            $this->setCustomOption("show_field", $field);
            
            $displayedOn = $this->dto->getDisplayedOn();
            $displayedOn->set(Crud::PAGE_INDEX, Crud::PAGE_INDEX);
            $this->dto->setDisplayedOn($displayedOn);
        }

        return $this;
    }

    public function setRequired(bool $required = true)
    {
        $this->setCustomOption("required", $required);
        return $this;
    }

    public function setExcludedFields($excludedFields): self
    {
        if(!is_array($excludedFields)) $excludedFields = [$excludedFields];
        $this->setFormTypeOption("excluded_fields", $excludedFields);
        return $this;
    }

    public function setDefaultLocale(string $defaultLocale): self
    {
        $this->setFormTypeOption("default_locale", $defaultLocale);
        return $this;
    }
    public function renderSingleLocale(?string $singleLocale = null): self
    {
        $singleLocale = $singleLocale ?? LocaleProvider::getDefaultLocale();
        $this->setFormTypeOption("single_locale", $singleLocale);
        return $this;
    }
}