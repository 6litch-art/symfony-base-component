<?php

namespace Base\Entity\Layout\Widget;

use Base\Database\Annotation\DiscriminatorEntry;
use Base\Entity\Layout\Attribute\Hyperlink;
use Base\Entity\Layout\Widget;
use Base\Model\IconizeInterface;
use Base\Model\LinkableInterface;
use Doctrine\ORM\Mapping as ORM;
use Base\Repository\Layout\Widget\LinkRepository;
use Base\Trait\UrlifyTrait;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * @ORM\Entity(repositoryClass=LinkRepository::class)
 * @ORM\Cache(usage="NONSTRICT_READ_WRITE")
 * @DiscriminatorEntry
 */

class Link extends Widget implements IconizeInterface, LinkableInterface
{
    public        function __iconize()       : ?array { return $this->getHyperlink()->__iconize(); }
    public static function __iconizeStatic() : ?array { return ["fas fa-share-square"]; }

    public function __toLink(int $referenceType = UrlGeneratorInterface::ABSOLUTE_PATH /* not used */): ?string
    {
        return $this->getHyperlink()->generate();
    }

    public function __toString()
    {
        return $this->getTitle() ?? $this->getHyperlink()->getLabel() ?? $this->__iconize();
    }

    public function __construct(?Hyperlink $hyperlink = null)
    {
        parent::__construct();

        if($hyperlink)
            $this->setHyperlink($hyperlink);
    }

    /**
     * @ORM\ManyToOne(targetEntity=Hyperlink::class, cascade={"persist"})
     * @ORM\Cache(usage="NONSTRICT_READ_WRITE")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $hyperlink;
    public function getHyperlink(): ?Hyperlink { return $this->hyperlink; }
    public function setHyperlink(Hyperlink $hyperlink)
    {
        $this->hyperlink = $hyperlink;
        return $this;
    }
}
