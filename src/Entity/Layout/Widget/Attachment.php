<?php

namespace Base\Entity\Layout\Widget;

use Base\Validator\Constraints as AssertBase;

use Base\Database\Annotation\DiscriminatorEntry;
use Base\Annotations\Annotation\Slugify;
use Base\Annotations\Annotation\Uploader;
use Base\Entity\Layout\Widget;
use Base\Model\IconizeInterface;
use Doctrine\ORM\Mapping as ORM;
use Base\Repository\Layout\Widget\AttachmentRepository;
/**
 * @ORM\Entity(repositoryClass=AttachmentRepository::class)
 * @DiscriminatorEntry( value = "attachment" )
 *
 * @AssertBase\UniqueEntity(fields={"slug"}, groups={"new", "edit"})
 */

class Attachment extends Widget implements IconizeInterface
{
    public        function __iconize()       : ?array { return null; } 
    public static function __staticIconize() : ?array { return ["fas fa-paperclip"]; } 

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Slugify(reference="translations.title")
     * @AssertBase\NotBlank(groups={"new", "edit"})
     */
    protected $slug;
    public function getSlug(): ?string { return $this->slug; }
    public function setSlug(string $slug): self
    {
        $this->slug = $slug;
        return $this;
    }

    /**
     * @ORM\Column(type="text")
     * @Uploader(storage="local.storage", public="/storage", size="4096K")
     * @AssertBase\FileSize(max="4096K", groups={"new", "edit"})
     */
    protected $file;

    public function getPath() { return Uploader::getPublic($this, "file"); }
    public function getFile() { return Uploader::get($this, "file"); }
    public function setFile($file)
    {
        $this->file = $file;
        return $this;
    }
}