<?php

namespace Base\Entity\Sitemap\Attribute\Abstract;

use Base\Annotations\Annotation\DiscriminatorEntry;
use Base\Field\Type\ArrayType;
use Base\Model\IconizeInterface;

use Doctrine\ORM\Mapping as ORM;
use Base\Repository\Sitemap\Attribute\Abstract\ArrayAttributeRepository;

/**
 * @ORM\Entity(repositoryClass=ArrayAttributeRepository::class)
 * @DiscriminatorEntry( value = "array" )
 */

class ArrayAttribute extends AbstractAttribute implements IconizeInterface
{
    public static function __staticIconize() : ?array { return ["fas fa-clipboard-list"]; }

    public static function getType(): string { return ArrayType::class; }
    public function getOptions(): array { return ["length" => 5]; }
}
