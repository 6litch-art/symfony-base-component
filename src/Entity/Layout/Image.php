<?php

namespace Base\Entity\Layout;

use Base\Entity\Layout\ImageCrop;
use Base\Validator\Constraints as AssertBase;

use Base\Annotations\Annotation\Uploader;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\Layout\ImageRepository;
use Base\Database\Annotation\DiscriminatorEntry;
use Base\Enum\Quadrant\Quadrant;
use Base\Model\IconizeInterface;
use Base\Traits\BaseTrait;
use Doctrine\ORM\Mapping\DiscriminatorColumn;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * @ORM\Entity(repositoryClass=ImageRepository::class)
 * @ORM\InheritanceType( "JOINED" )
 *
 * @ORM\Cache(usage="NONSTRICT_READ_WRITE")
 * @ORM\DiscriminatorColumn( name = "type", type = "string" )
 *     @DiscriminatorEntry
 */
class Image implements IconizeInterface
{
    use BaseTrait;

    public function __toLink(int $referenceType = UrlGeneratorInterface::ABSOLUTE_PATH): ?string
    {
        $routeName = "ux_image";
        $routeParameters = ["hashid" => $this->getImageService()->obfuscate($this->getSource())];
        return $this->getRouter()->generate($routeName, $routeParameters, $referenceType);
    }

    public        function __iconize()       : ?array { return null; }
    public static function __iconizeStatic() : ?array { return ["fas fa-images"]; }

    public function __toString() { return Uploader::getPublic($this, "source") ?? $this->getService()->getParameterBag("base.image.no_image") ?? ""; }
    public function __construct($src = null)
    {
        $this->crops = new ArrayCollection();
        $this->setSource($src);
    }

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    protected $id;
    public function getId(): ?int { return $this->id; }

    /**
     * @ORM\Column(type="text")
     * @AssertBase\File(max_size="5MB", groups={"new", "edit"})
     * @Uploader(storage="local.storage", max_size="5MB", mime_types={"image/gif", "image/png", "image/jpeg", "image/bmp", "image/webp"})
     */
    protected $source;
    public function getSource()     { return Uploader::getPublic($this, "source"); }
    public function getSourceFile() { return Uploader::get($this, "source"); }
    public function setSource($source): self
    {
        $this->source = $source;
        $this->sourceMeta = null;
        return $this;
    }

    private $sourceMeta;
    public function getSourceMeta(): array|null|false
    {
        $sourceFile = $this->getSourceFile();
        if($sourceFile === null) return null;

        $this->sourceMeta = $this->sourceMeta ?? getimagesize($sourceFile->getPathname());
        return $this->sourceMeta;
    }

    public function get()     { return $this->getSource(); }
    public function getFile() { return $this->getSourceFile(); }
    public function set($source): self { return $this->setSource($source); }

    /**
     * @ORM\Column(type="quadrant8")
     */
    protected $quadrant = Quadrant::O;
    public function getQuadrant(): string { return $this->quadrant; }
    public function setQuadrant(string $quadrant): self
    {
        $this->quadrant = $quadrant;
        return $this;
    }

    /**
     * @ORM\OneToMany(targetEntity=ImageCrop::class, mappedBy="image", orphanRemoval=true, cascade={"persist", "remove"})
     */
    protected $crops;

    public function getPreferredCrop(
        string|int $slugOrRatio, float $ratioTolerance = 1e-2,
        ?int $width = null, ?int $height = null, int $dimTolerance = 10 /* pixels */): ?ImageCrop
    {
        $preferredCrop = $this->getCrops($slugOrRatio, $ratioTolerance)
            ->Filter(fn($c) => abs($c->getWidth () - $width ) < $dimTolerance)
            ->Filter(fn($c) => abs($c->getHeight() - $height) < $dimTolerance)->First();

        return $preferredCrop === false ? null : $preferredCrop;
    }

    public function getCrops(string|int|null $slugOrRatio = null, float $ratioTolerance = 1e-2): Collection
    {
        return $this->crops->Filter(function($c) use ($slugOrRatio, $ratioTolerance)
        {
            if(is_string($slugOrRatio)) return $c->getSlug() && $c->getSlug() == $slugOrRatio;
            if(is_numeric($slugOrRatio)) return ($c->getRatio() - $slugOrRatio) < $ratioTolerance;
            return true;
        });
    }

    public function addCrop(ImageCrop $crop): self
    {
        if (!$this->crops->contains($crop)) {
            $this->crops[] = $crop;
            $crop->setImage($this);
        }

        return $this;
    }

    public function removeCrop(ImageCrop $crop): self
    {
        if ($this->crops->removeElement($crop)) {
            // set the owning side to null (unless already changed)
            if ($crop->getImage() === $this) {
                $crop->setImage(null);
            }
        }

        return $this;
    }
}
