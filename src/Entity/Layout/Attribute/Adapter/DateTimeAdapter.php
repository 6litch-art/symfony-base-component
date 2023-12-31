<?php

namespace Base\Entity\Layout\Attribute\Adapter;

use Base\Database\Annotation\DiscriminatorEntry;
use Base\Entity\Layout\Attribute\Adapter\Common\AbstractAdapter;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;

use Doctrine\ORM\Mapping as ORM;
use Base\Repository\Layout\Attribute\Adapter\DateTimeAdapterRepository;
use Base\Database\Annotation\Cache;

/**
 * @ORM\Entity(repositoryClass=DateTimeAdapterRepository::class)
 * @Cache(usage="NONSTRICT_READ_WRITE", associations="ALL")
 * @DiscriminatorEntry( value = "datetime" )
 */

class DateTimeAdapter extends AbstractAdapter
{
    public static function __iconizeStatic(): ?array
    {
        return ["fa-solid fa-calendar"];
    }

    public static function getType(): string
    {
        return DateTimeType::class;
    }
    public function getOptions(): array
    {
        return [
        ];
    }

    public function resolve(mixed $value): mixed
    {
        return $value;
    }
}
