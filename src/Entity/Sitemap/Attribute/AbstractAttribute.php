<?php

namespace Base\Entity\Sitemap\Attribute;

use Base\Annotations\Annotation\DiscriminatorEntry;
use Base\Annotations\Annotation\Slugify;
use Base\Database\TranslatableInterface;
use Base\Database\Traits\TranslatableTrait;
use Base\Model\IconizeInterface;

use Base\Validator\Constraints as AssertBase;

use Doctrine\ORM\Mapping as ORM;
use Base\Repository\Sitemap\Attribute\AbstractAttributeRepository;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;

/**
 * @ORM\Entity(repositoryClass=AbstractAttributeRepository::class)
 * @ORM\InheritanceType( "JOINED" )
 * 
 * @ORM\DiscriminatorColumn( name = "type", type = "string" )
 *     @DiscriminatorEntry( value = "abstract" )
 * 
 * @AssertBase\UniqueEntity(fields={"code"}, groups={"new", "edit"})
 */
class AbstractAttribute implements AbstractAttributeInterface, TranslatableInterface, IconizeInterface
{
    use TranslatableTrait;

    public        function __iconize()       : ?array { return null; } 
    public static function __staticIconize() : ?array { return ["fas fa-share-alt"]; }

    public static function getType(): string { return HiddenType::class; }
    public static function getOptions(): array { return []; }

    public function __construct(?string $code = null, ?string $icon = null)
    {
        $this->setCode($code);
        $this->setIcon($icon ?? $this->__iconize()[0] ?? get_called_class()::__staticIconize()[0]);
    }

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    protected $id;
    public function getId(): ?int { return $this->id; }

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @AssertBase\NotBlank(groups={"new", "edit"})
     * @Slugify(separator="-")
     */
    protected $code;
    public function getCode(): ?string  { return $this->code; }
    public function setCode(?string $code): self
    {
        $this->code = $code;
        return $this;
    }

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $icon;
    public function getIcon(): ?string { return $this->icon; }
    public function setIcon(?string $icon)
    {
        $this->icon = $icon;
        return $this;
    }

}