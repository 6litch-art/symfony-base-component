<?php

namespace Base\Entity\Layout\Widget\Set;

use Base\Database\Annotation\DiscriminatorEntry;
use Base\Database\Annotation\OrderColumn;
use Base\Entity\Layout\Attribute\Hyperlink;
use Base\Entity\Layout\Widget;
use Base\Service\Model\IconizeInterface;

use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

use Doctrine\ORM\Mapping as ORM;
use Base\Repository\Layout\Widget\Set\LinksetRepository;

use Base\Database\Annotation\Cache;

/**
 * @ORM\Entity(repositoryClass=LinksetRepository::class)
 * @Cache(usage="NONSTRICT_READ_WRITE", associations="ALL")
 * @DiscriminatorEntry
 */
class Linkset extends Widget implements IconizeInterface, SetInterface
{
    public function __iconize(): ?array
    {
        return null;
    }
    public static function __iconizeStatic(): ?array
    {
        return ["fa-solid fa-layer-group"];
    }

    public function __construct(?string $title = null, array $hyperlinks = [])
    {
        $this->hyperlinks = new ArrayCollection($hyperlinks);
        parent::__construct($title);
    }

    /**
     * @ORM\ManyToMany(targetEntity=Hyperlink::class, orphanRemoval=true, cascade={"persist"})
     * @OrderColumn
     */
    protected $hyperlinks;
    public function getHyperlinks(): Collection
    {
        return $this->hyperlinks;
    }
    public function addHyperlink(Hyperlink $hyperlink): self
    {
        if (!$this->hyperlinks->contains($hyperlink)) {
            $this->hyperlinks[] = $hyperlink;
        }

        return $this;
    }

    public function removeHyperlink(Hyperlink $hyperlink): self
    {
        $this->hyperlinks->removeElement($hyperlink);
        return $this;
    }
}
