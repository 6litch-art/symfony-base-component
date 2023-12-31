<?php

namespace Base\Entity\Layout\Widget;

use Base\Validator\Constraints as AssertBase;

use Base\Database\Annotation\DiscriminatorEntry;
use Base\Annotations\Annotation\Slugify;
use Base\Entity\Layout\Widget;
use Base\Service\Model\IconizeInterface;
use Base\Service\Model\LinkableInterface;
use Doctrine\ORM\Mapping as ORM;
use Base\Repository\Layout\Widget\PageRepository;
use Base\Service\BaseService;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

use Base\Database\Annotation\Cache;

/**
 * @ORM\Entity(repositoryClass=PageRepository::class)
 * @DiscriminatorEntry
 * @Cache(usage="NONSTRICT_READ_WRITE", associations="ALL")
 *
 * @AssertBase\UniqueEntity(fields={"slug"}, groups={"new", "edit"})
 */

class Page extends Widget implements IconizeInterface, LinkableInterface
{
    public function __iconize(): ?array
    {
        return null;
    }
    public static function __iconizeStatic(): ?array
    {
        return ["fa-solid fa-file-alt"];
    }

    public function __toLink(array $routeParameters = [], int $referenceType = UrlGeneratorInterface::ABSOLUTE_PATH): ?string
    {
        $routeParameters = array_merge($routeParameters, ["slug" => $this->getSlug()]);

        return $this->getRouter()->generate("widget_page", $routeParameters, $referenceType);
    }

    public function __toString()
    {
        return $this->getTitle();
    }

    public function __construct(?string $title = null, ?string $slug = null)
    {
        parent::__construct($title);
        $this->setSlug($slug);
    }

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Slugify(reference="translations.title")
     * @AssertBase\NotBlank(groups={"new", "edit"})
     */
    protected $slug;
    public function getSlug(): ?string
    {
        return $this->slug;
    }
    public function setSlug(?string $slug): self
    {
        $this->slug = $slug;
        return $this;
    }

    /**
     * Add article content with reshaped titles
     */
    public const MAX_ANCHOR = 6;
    public function getContentWithAnchors(array $options = [], $suffix = "", $max = self::MAX_ANCHOR): ?string
    {
        $max = min($max, self::MAX_ANCHOR);
        return preg_replace_callback("/\<(h[1-".$max."])\>([^\<\>]*)\<\/h[1-".$max."]\>/", function ($match) use ($suffix, $options) {
            $tag = $match[1];
            $content = $match[2];
            $slug = strtolower($this->getSlugger()->slug($content));

            $options["attr"]["class"] = $options["attr"]["class"] ?? "";
            $options["attr"]["class"] = trim($options["attr"]["class"] . " anchor");

            return "<".$tag." ".html_attributes($options["row_attr"] ?? [], ["id" => $slug])."><a ".html_attributes($options["attr"] ?? [])." href='#" . $slug . "'>".$content."</a><a href='#" . $slug . "'>".$suffix."</a></".$tag.">";
        }, $this->content);
    }

    /**
     * Compute table of content
     */
    public function getTableOfContent($max = 6): array
    {
        $headlines = [];
        $max = min($max, 6);

        preg_replace_callback("/\<(h[1-".$max."])\>([^\<\>]*)\<\/h[1-".$max."]\>/", function ($match) use (&$headlines) {
            $headlines[] = [
                "tag" => $match[1],
                "slug"  => strtolower($this->getSlugger()->slug($match[2])),
                "title" => $match[2]
            ];
        }, $this->content);

        return $headlines;
    }
}
