<?php

namespace Base\Entity\Sitemap;


use Base\Database\TranslatableInterface;
use Base\Database\Traits\TranslatableTrait;
use Base\Model\IconizeInterface;
use Doctrine\ORM\Mapping as ORM;
use Base\Repository\Sitemap\SettingRepository;

/**
 * @ORM\Entity(repositoryClass=SettingRepository::class)
 */
class Setting implements TranslatableInterface, IconizeInterface
{
    use TranslatableTrait;
    public function getOneOrNullValue()
    {
        $value = $this->getValue();
        if(is_array($value)) return $value[0] ?? null;
        return $value;
    }

    public static function __iconize(): array { return ["fas fa-tools"]; }
        
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    protected $id;
    public function getId(): ?int { return $this->id; }

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * 
     */
    protected $name;

    public function getName(): string { return $this->name; }
    public function setName(string $name)
    {
        $this->name = $name;
        return $this;
    }

    public function __construct(string $name, $value)
    {
        $this->setName($name);
        $this->setValue($value);
    }

    public function __toString() { return $this->getName() ?? ""; }
}
