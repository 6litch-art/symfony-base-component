<?php

namespace Base\Entity\Layout\Attribute\Adapter;

use Base\Database\Annotation\DiscriminatorEntry;
use Symfony\Component\Form\Extension\Core\Type\PercentType;

use Doctrine\ORM\Mapping as ORM;
use Base\Repository\Layout\Attribute\Adapter\PercentAdapterRepository;

/**
 * @ORM\Entity(repositoryClass=PercentAdapterRepository::class)
 * @ORM\Cache(usage="NONSTRICT_READ_WRITE")
 * @DiscriminatorEntry( value = "percent" )
 */

class PercentAdapter extends AbstractAdapter
{
    public static function __iconizeStatic() : ?array { return ["fas fa-percent"]; }

    public static function getType(): string { return PercentType::class; }
    public function getOptions(): array { return []; }
    public function resolve(mixed $value): mixed { return $value; }

    public function __construct(string $label, ?string $code = null, int $epsilon = 4, int $scale = 2)
    {
        parent::__construct($label, $code);
        $this->setPrecision($epsilon);
        $this->setScale($scale);
    }

    /**
     * @ORM\Column(type="integer")
     */
    protected $epsilon;

    public function getPrecision():int     { return $this->epsilon; }
    public function setPrecision(int $epsilon)
    {
        $this->epsilon = $epsilon;
        return $this;
    }

    /**
     * @ORM\Column(type="integer")
     */
    protected $scale;

    public function getScale():int     { return $this->scale; }
    public function setScale(int $scale)
    {
        $this->scale = $scale;
        return $this;
    }
}