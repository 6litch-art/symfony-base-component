<?php

namespace Base\Entity\Layout;

use Base\Database\Annotation\DiscriminatorEntry;
use Base\Database\TranslatableInterface;
use Base\Database\Traits\TranslatableTrait;
use Base\Entity\Layout\Attribute\Abstract\AbstractAttribute;
use Base\Entity\Layout\Attribute\Common\BaseAttribute;

use Doctrine\ORM\Mapping as ORM;
use Base\Repository\Layout\AttributeRepository;

/**
 * @ORM\Entity(repositoryClass=AttributeRepository::class)
 * @DiscriminatorEntry
 * 
 * @ORM\Cache(usage="NONSTRICT_READ_WRITE")
 */

class Attribute extends BaseAttribute implements TranslatableInterface
{
    use TranslatableTrait;

    public function __construct(AbstractAttribute $adapter, mixed $value = null)
    {
        parent::__construct($adapter);
        $this->setValue($value);
    }

    public function __toString() 
    {
        $value = $this->resolve();
        $value = (is_array($value) ? implode(", ",$value) : $value);
        return "<b>".$this->getAdapter()."</b>". ($value ? " : ".$value : ""); 
    }

    public function get(?string $locale = null): mixed { return $this->getValue($locale); }
    public function set(...$args): self { return array_key_exists("value", $args) ? $this->setValue($args["value"]) : $this; }
    public function resolve(?string $locale = null): mixed 
    {
        return $this->adapter->resolve($this->translate($locale)->getValue()) ?? null;
    }
}