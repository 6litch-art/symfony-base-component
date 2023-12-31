<?php

namespace Base\Twig\Extension;

use Base\Controller\UX\FileController;
use Base\Imagine\Filter\Basic\CropFilter;
use Base\Routing\AdvancedRouter;
use Base\Service\Model\LinkableInterface;
use Base\Routing\RouterInterface;
use Base\Service\FileService;
use Base\Service\IconProvider;
use Base\Service\ImageService;
use Base\Service\Obfuscator;
use Base\Twig\Environment;
use Imagine\Image\ImageInterface;
use Symfony\Bridge\Twig\Mime\WrappedTemplatedEmail;
use TijsVerkoyen\CssToInlineStyles\CssToInlineStyles;
use Twig\Error\LoaderError;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;
use Twig\TwigTest;

final class FileTwigExtension extends AbstractExtension
{
    /**
     * @var Router
     */
    protected $router;

    /**
     * @var FileController
     */
    protected $fileController;

    /**
     * @var ImageService
     */
    protected $imageService;

    /** @var string */
    protected $projectDir;

    public function __construct(RouterInterface $router, ImageService $imageService, FileController $fileController, string $projectDir)
    {
        $this->projectDir = $projectDir;

        $this->router = $router;
        $this->fileController = $fileController;

        $this->imageService = $imageService;
        $this->imageService->setController($fileController);
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('urlify', [$this, 'urlify'], ["is_safe" => ['all']]),
            new TwigFunction('linkify', [$this, 'linkify'], ["is_safe" => ['all']]),
            new TwigFunction('embed', [$this, 'embed'], ['needs_environment' => true, 'needs_context' => true]),
            new TwigFunction('url', [$this, 'url'], ['needs_context' => true]),

            new TwigFunction('iconify', [IconProvider::class, 'iconify'], ["is_safe" => ['all']]),
            new TwigFunction('imagify', [ImageService::class, 'imagify'], ["is_safe" => ['all']]),
            new TwigFunction('imageset', [ImageService::class, 'imageSet'], ["is_safe" => ['all']]),
            new TwigFunction('urlify', [$this, 'urlify'], ["is_safe" => ['all']]),
            new TwigFunction('linkify', [$this, 'linkify'], ["is_safe" => ['all']]),
            new TwigFunction('lightbox', [ImageService::class, 'lightbox'], ["is_safe" => ['all']]),
            new TwigFunction('image', [$this, 'image']),

            new TwigFunction('file_exists', 'file_exists'),

            new TwigFunction('asset', [AdvancedRouter::class, 'getAssetUrl']),
        ];
    }

    public function getTests(): array
    {
        return [
            new TwigTest('ondisk', [$this, 'onDisk'])
        ];
    }

    public function getFilters(): array
    {
        return
            [
                new TwigFilter('iconify', [IconProvider::class, 'iconify'], ["is_safe" => ['all']]),
                new TwigFilter('imagify', [ImageService::class, 'imagify'], ["is_safe" => ['all']]),
                new TwigFilter('imageset', [ImageService::class, 'imageSet'], ["is_safe" => ['all']]),
                new TwigFilter('urlify', [$this, 'urlify'], ["is_safe" => ['all']]),
                new TwigFilter('linkify', [$this, 'linkify'], ["is_safe" => ['all']]),

                new TwigFilter('public', [FileService::class, 'public']),
                new TwigFilter('downloadable', [FileService::class, 'downloadable']),
                new TwigFilter('mimetype', [FileService::class, 'getMimeType']),
                new TwigFilter('extensions', [FileService::class, 'getExtensions']),

                new TwigFilter('inline_css_email', [$this, 'inline_css_email'], ['needs_context' => true, "is_safe" => ['all']]),
                new TwigFilter('embed', [$this, 'embed'], ['needs_environment' => true, 'needs_context' => true]),
                new TwigFilter('url', [$this, 'url'], ['needs_context' => true]),

                new TwigFilter('asset', [AdvancedRouter::class, 'getAssetUrl']),
                new TwigFilter('filesize', [FileService::class, 'filesize']),
                new TwigFilter('obfuscate', [Obfuscator::class, 'encode']),
                new TwigFilter('obfuscate_file', [FileService::class, 'obfuscate']),
                new TwigFilter('obfuscate_image', [ImageService::class, 'obfuscate']),
                new TwigFilter('lightbox', [ImageService::class, 'lightbox'], ["is_safe" => ['all']]),

                new TwigFilter('imagine', [$this, 'imagine'], ['needs_context' => true]),
                new TwigFilter('webp', [$this, 'imagine'], ['needs_context' => true]),
                new TwigFilter('image', [$this, 'imagine'], ['needs_context' => true]),
                new TwigFilter('crop', [$this, 'imagineCrop'], ['needs_context' => true]),
                new TwigFilter('thumbnail', [$this, 'thumbnail'], ['needs_context' => true]),
                new TwigFilter('thumbnail_inset   ', [$this, 'thumbnailInset   '], ['needs_context' => true]),
                new TwigFilter('thumbnail_outbound', [$this, 'thumbnailOutbound'], ['needs_context' => true]),
                new TwigFilter('thumbnail_noclone ', [$this, 'thumbnailNoclone '], ['needs_context' => true]),
                new TwigFilter('thumbnail_upscale ', [$this, 'thumbnailUpscale '], ['needs_context' => true]),
            ];
    }

    public function onDisk(string $file): bool
    {
        return file_exists(sanitize_url($this->projectDir . "/public/" . $file));
    }

    public function imagine(array $context, array|string|null $path, array $filters = [], array $config = []): array|string|null
    {
        $config["local_cache"] ??= true;
        if (array_key_exists("warmup", $context)) {
            $config["warmup"] = $context["warmup"];
        }

        $email = $context["email"] ?? null;
        if ($email instanceof WrappedTemplatedEmail) {
            $config["warmup"] = true;
            $config["webp"]   = false;
        }

        return $this->imageService->imagine($path, $filters, $config);
    }

    public function imagineCrop(array $context, array|string|null $path, int $x = 0, int $y = 0, ?int $width = null, ?int $height = null, string $position = "leftop", array $filters = [], array $config = []): array|string|null
    {
        $config["local_cache"] ??= true;
        if (array_key_exists("warmup", $context)) {
            $config["warmup"] = $context["warmup"];
        }

        $email = $context["email"] ?? null;
        if ($email instanceof WrappedTemplatedEmail) {
            $config["warmup"] = true;
            $config["webp"]   = false;
        }

        return $this->imageService->crop($path, $x, $y, $width, $height, $position, $filters, $config);
    }

    public function thumbnailInset(array $context, array|string|null $path, ?int $width = null, ?int $height = null, array $filters = [], array $config = []): array|string|null
    {
        return $this->thumbnail($context, $path, $width, $height, $filters, array_merge($config, ["mode" => ImageInterface::THUMBNAIL_INSET]));
    }
    public function thumbnailOutbound(array $context, array|string|null $path, ?int $width = null, ?int $height = null, array $filters = [], array $config = []): array|string|null
    {
        return $this->thumbnail($context, $path, $width, $height, $filters, array_merge($config, ["mode" => ImageInterface::THUMBNAIL_OUTBOUND]));
    }
    public function thumbnailNoclone(array $context, array|string|null $path, ?int $width = null, ?int $height = null, array $filters = [], array $config = []): array|string|null
    {
        return $this->thumbnail($context, $path, $width, $height, $filters, array_merge($config, ["mode" => ImageInterface::THUMBNAIL_FLAG_NOCLONE]));
    }
    public function thumbnailUpscale(array $context, array|string|null $path, ?int $width = null, ?int $height = null, array $filters = [], array $config = []): array|string|null
    {
        return $this->thumbnail($context, $path, $width, $height, $filters, array_merge($config, ["mode" => ImageInterface::THUMBNAIL_FLAG_UPSCALE]));
    }
    public function thumbnail(array $context, array|string|null $path, ?int $width = null, ?int $height = null, array $filters = [], array $config = []): array|string|null
    {
        $config["local_cache"] ??= true;
        if (array_key_exists("warmup", $context)) {
            $config["warmup"] = $context["warmup"];
        }

        $email = $context["email"] ?? null;
        if ($email instanceof WrappedTemplatedEmail) {
            $config["warmup"] = true;
            $config["webp"]   = false;
        }

        return $this->imageService->thumbnail($path, $width, $height, $filters, $config);
    }

    public function urlify(LinkableInterface|string|null $urlOrPath, ?string $label = null, array $attributes = [])
    {
        $url   = $urlOrPath;
        $label = $label ?? $urlOrPath;
        if ($urlOrPath instanceof LinkableInterface) {
            $url   = $urlOrPath->__toLink();
            $label = $label ?? $urlOrPath->__toString();
        }

        if ($this->router->getUrl() == $this->router->getAssetUrl($urlOrPath)) {
            $attributes["class"] = trim(($attributes["class"] ?? "")." highlight");
        }

        if (!$url) {
            return "";
        }

        return "<a href='".$url."' ".html_attributes($attributes).">".$label."</a>";
    }

    public function linkify(mixed $urlOrPath)
    {
        $url   = $urlOrPath;
        if ($urlOrPath instanceof LinkableInterface) {
            $url   = $urlOrPath->__toLink();
        }

        return is_object($url) ? null : (is_string($url) ? $url : null);
    }

    public function url(array $context, ?string $name, array $parameters = [], int $referenceType = AdvancedRouter::ABSOLUTE_PATH)
    {
        if ($name == null) {
            return $name;
        }

        $email = $context["email"] ?? null;
        $referenceType = $email instanceof WrappedTemplatedEmail ? AdvancedRouter::ABSOLUTE_URL : $referenceType;

        return trim($this->router->getUrl($name, $parameters, $referenceType));
    }

    public function inline_css_email(array $context, string $body, string ...$css): string
    {
        static $inliner;
        if (null === $inliner) {
            $inliner = new CssToInlineStyles();
        }

        $email = $context["email"] ?? null;
        return $email ? $inliner->convert($body, implode("\n", $css)) : $body;
    }

    public function embed(Environment $twig, array $context, string $src, array $options = [])
    {
        if (!$src) {
            return $src;
        }

        if (!str_starts_with($src, "@")) {
            $src = "@Public/".str_lstrip($src, [$this->projectDir."/public", "/"]);
        }

        try {
            $path = $twig->getLoader()->getSourceContext($src)->getPath();
            $contentType = mime_content_type($twig->getLoader()->getSourceContext($src)->getPath());

            $url = explode("/", $twig->getLoader()->getSourceContext($src)->getName());
            $prefix = str_rstrip($path, [implode("/", tail($url)), "/"]);
        } catch (LoaderError $e) {
            throw $e;
        }

        $email = $options["email"] ?? $context["email"] ?? null;

        return $email instanceof WrappedTemplatedEmail ? $email->image($src, $contentType) : str_lstrip($path, [
            $prefix,
            $this->projectDir."/public",
            $this->projectDir
        ]);
    }
}
