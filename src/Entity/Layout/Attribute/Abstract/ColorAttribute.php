<?php

namespace Base\Entity\Layout\Attribute\Abstract;

use Base\Service\Model\Color\Intl\Colors;
use Base\Database\Annotation\DiscriminatorEntry;
use Base\Field\Type\ColorType;
use Base\Service\Model\IconizeInterface;

use Doctrine\ORM\Mapping as ORM;
use Base\Repository\Layout\Attribute\Abstract\ColorAttributeRepository;

/**
 * @ORM\Entity(repositoryClass=ColorAttributeRepository::class)
 * @ORM\Cache(usage="NONSTRICT_READ_WRITE")
 * @DiscriminatorEntry( value = "color" )
 */

class ColorAttribute extends AbstractAttribute implements IconizeInterface
{
    public static function __iconizeStatic() : ?array { return ["fas fa-tint"]; }

    public static function getType(): string { return ColorType::class; }
    public function getOptions(): array { return []; }
    public function resolve(mixed $value): mixed { return $value; }

    public function getName(string $locale = null): string
    {
        return Colors::getName($this->color, $locale);
    }
}
