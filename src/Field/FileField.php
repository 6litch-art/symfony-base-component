<?php

namespace Base\Field;

use EasyCorp\Bundle\EasyAdminBundle\Config\Option\TextAlign;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldInterface;

use Symfony\Component\Form\Extension\Core\Type\FileType;

use EasyCorp\Bundle\EasyAdminBundle\Field\FieldTrait;

final class FileField implements FieldInterface
{
    use FieldTrait;

    public const OPTION_RENDER_FORMAT  = "renderFormat";

    public static function new(string $propertyName, ?string $label = null): self
    {
        return (new self())
            ->setProperty($propertyName)
            ->setLabel($label)
            ->setTemplateName('crud/field/image')
            ->setFormType(FileType::class)
            ->addCssClass('field-avatar')
            ->setTemplatePath('@Base/crud/field/file.html.twig')
            ->setTextAlign(TextAlign::CENTER)
            ->setFormTypeOption("data_class", null)
            ->setCustomOption(self::OPTION_RENDER_FORMAT, "count");
    }

    public function setMultipleFiles(bool $multipleFiles = true): self
    {
        $this->setFormTypeOption("multiple", $multipleFiles);
        return $this;
    }

    public function renderAsText(): self
    {
        $this->setCustomOption(self::OPTION_RENDER_FORMAT, "text");
        return $this;
    }

    public function renderAsCount(): self
    {
        $this->setCustomOption(self::OPTION_RENDER_FORMAT, "count");
        return $this;
    }

    public function renderAsImage(): self
    {
        $this->setCustomOption(self::OPTION_RENDER_FORMAT, "image");
        $this->setCssClass("field-image");
        return $this;
    }

    public function renderAsAvatar(): self
    {
        $this->setCustomOption(self::OPTION_RENDER_FORMAT, "avatar");
        $this->setCssClass("field-avatar");
        return $this;
    }
}
