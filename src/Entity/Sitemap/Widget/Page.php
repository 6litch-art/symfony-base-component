<?php

namespace Base\Entity\Sitemap\Widget;

use Base\Validator\Constraints as AssertBase;

use Base\Annotations\Annotation\DiscriminatorEntry;
use Base\Annotations\Annotation\Slugify;
use Base\Entity\Sitemap\Widget;

use Doctrine\ORM\Mapping as ORM;
use Base\Repository\Sitemap\Widget\PageRepository;

/**
 * @ORM\Entity(repositoryClass=PageRepository::class)
 * @DiscriminatorEntry( value = "page" )
 *
 * @AssertBase\UniqueEntity(fields={"slug"}, groups={"new", "edit"})
 */

class Page extends Widget 
{
    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Slugify(reference="translations.title")
     */
    protected $slug;
    public function getSlug(): ?string { return $this->slug; }
    public function setSlug(string $slug): self
    {
        $this->slug = $slug;
        return $this;
    }
}