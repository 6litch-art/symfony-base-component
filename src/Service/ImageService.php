<?php

namespace Base\Service;

use Base\Filter\Basic\ThumbnailFilter;
use Base\Filter\Format\BitmapFilter;
use Base\Filter\Format\SvgFilter;
use Base\Filter\FormatFilterInterface;
use Exception;

use Imagine\Filter\FilterInterface;
use Imagine\Image\ImageInterface;
use Imagine\Image\ImagineInterface;
use Imagine\Image\Palette\CMYK;
use Imagine\Image\Palette\RGB;
use Symfony\Bridge\Twig\Extension\AssetExtension;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\RouterInterface;

class ImageService extends FileService implements ImageServiceInterface
{
    /**
     * @var ImagineInterface
     */
    protected $imagine;

    public function __construct(RouterInterface $router, ObfuscatorInterface $obfuscator, AssetExtension $assetExtension, Filesystem $filesystem, ParameterBagInterface $parameterBag, ImagineInterface $imagineBitmap, ImagineInterface $imagineSvg)
    {
        parent::__construct($router, $obfuscator, $assetExtension, $filesystem);

        $this->imagineBitmap = $imagineBitmap;
        $this->imagineSvg    = $imagineSvg;

        $this->maxResolution = $parameterBag->get("base.image.max_resolution");
        $this->maxQuality    = $parameterBag->get("base.image.max_quality");
        $this->enableWebp    = $parameterBag->get("base.image.enable_webp");
        $this->noImage       = $parameterBag->get("base.image.no_image");

        // Local cache directory for filtered images
        $this->localCache = "local.cache";
    }

    public function getMaximumQuality() { return $this->maxQuality; }
    public function isWebpEnabled() { return $this->enableWebp; }

    public function webp   (array|string|null $path, array $filters = [], array $config = []): array|string|null { return $this->generate("ux_imageWebp", [], $path, array_merge($config, ["filters" => $filters])); }
    public function image  (array|string|null $path, array $filters = [], array $config = []): array|string|null { return $this->generate("ux_image"    , [], $path, array_merge($config, ["filters" => $filters])); }
    public function imagine(array|string|null $path, array $filters = [], array $config = []): array|string|null { return browser_supports_webp() ? $this->webp($path, $filters, $config) : $this->image($path, $filters, $config); }
    public function imagify(null|array|string $path, array $attributes = []): ?string
    {
        if(!$path) return $path;
        if(is_array($path)) return array_map(fn($p) => $this->imagify($p), $path);

        if($attributes["src"] ?? false)
            unset($attributes["src"]);

        return "<img ".html_attributes($attributes)." src='".$this->imagine($path)."' />";
    }

    public function thumbnail_inset   (array|string|null $path, ?int $width = null , ?int $height = null, array $filters = [], array $config = []): array|string|null { return $this->thumbnail($path, $width, $height, $filters, array_merge($config, ["mode" => ImageInterface::THUMBNAIL_INSET])); }
    public function thumbnail_outbound(array|string|null $path, ?int $width = null , ?int $height = null, array $filters = [], array $config = []): array|string|null { return $this->thumbnail($path, $width, $height, $filters, array_merge($config, ["mode" => ImageInterface::THUMBNAIL_OUTBOUND])); }
    public function thumbnail_noclone (array|string|null $path, ?int $width = null , ?int $height = null, array $filters = [], array $config = []): array|string|null { return $this->thumbnail($path, $width, $height, $filters, array_merge($config, ["mode" => ImageInterface::THUMBNAIL_FLAG_NOCLONE])); }
    public function thumbnail_upscale (array|string|null $path, ?int $width = null , ?int $height = null, array $filters = [], array $config = []): array|string|null { return $this->thumbnail($path, $width, $height, $filters, array_merge($config, ["mode" => ImageInterface::THUMBNAIL_FLAG_UPSCALE])); }
    public function thumbnail(array|string|null $path, ?int $width = null , ?int $height = null, array $filters = [], array $config = []): array|string|null
    {
        $filters[] = new ThumbnailFilter(
            $width, $height ?? null,
            $config["mode"]  ?? ImageInterface::THUMBNAIL_INSET,
            $config["resampling"] ?? ImageInterface::FILTER_UNDEFINED
        );

        $config = array_key_removes($config, "width", "height", "mode", "resampling");
        return $this->imagine($path, $filters, $config);
    }

    public function obfuscate(string|null $path, array $config = [], array $filters = []): ?string
    {
        if($path === null ) return null;
        $path = "/".str_strip($path, $this->assetExtension->getAssetUrl(""));

        $config["path"] = $path;
        $config["options"] = array_merge(["quality" => $this->getMaximumQuality()], $config["options"] ?? []);
        $config["local_cache"] = $config["local_cache"] ?? null;
        if(!empty($filters)) $config["filters"] = $filters;

        while ( ($pathConfig = $this->obfuscator->decode(basename($path))) ) {

            $path = $pathConfig["path"] ?? $path;
            $config["path"] = $path;
            $config["filters"] = ($pathConfig["filters"] ?? []) + ($config["filters"] ?? []);
            $config["options"] = ($pathConfig["options"] ?? []) + ($config["options"] ?? []);
            $config["local_cache"] = $pathConfig["local_cache"] ?? $config["local_cache"];
        }

        return $this->obfuscator->encode($config);
    }

    public function generate(string $proxyRoute, array $proxyRouteParameters = [], ?string $path = null, array $config = []): ?string
    {
        if(!$path) return null;

        $config["filters"] ??= [];
        return parent::generate($proxyRoute, $proxyRouteParameters, $path, $config);
    }

    public function resolve(string $hashid, array $filters = [])
    {
        $args = parent::resolve($hashid);
        $args["filters"]  = array_merge($args["filters"] ?? [], $filters);

        return $args;
    }

    public function serve(?string $file, int $status = 200, array $headers = []): ?Response
    {
        if(!file_exists($file)) {
            $file = $this->noImage;
            array_pop_key("http_cache", $headers);
        }

        return parent::serve($file, $status, $headers);
    }

    public function filter(?string $path, FilterInterface|array $filters = [], array $config = []): ?string
    {
        if(!is_array($filters)) $filters = [$filters];

        //
        // Resolve nested paths
        $args    = $this->resolve($path, $filters);
        $path    = $args["path"]; // Cache directory location
        $filters = $args["filters"];

        //
        // Apply image resolution limitation
        if(!is_instanceof($this->maxResolution, ThumbnailFilter::class))
            throw new Exception("Resolution filter \"".$this->maxResolution."\" must inherit from ".ThumbnailFilter::class);

        //
        // Extract last filter
        $filters = array_filter($filters, fn($f) => class_implements_interface($f, FilterInterface::class));
        $formatter = end($filters);
        if($formatter === null)
            throw new Exception("Last filter is missing.");

        //
        // Apply size limitation to bitmap only
        if($formatter instanceof BitmapFilter) {

            $definitionFilters = array_filter($formatter->getFilters(), fn($f) => $f instanceof ThumbnailFilter);
            if(empty($definitionFilters))
                $formatter->addFilter(new $this->maxResolution);

            if(!class_implements_interface($formatter, FormatFilterInterface::class))
                throw new \Exception("Last filter \"".($formatter ? get_class($formatter) : null)."\" must implement \"".FormatFilterInterface::class."\"");
        }

        $filtersButLast = array_slice($filters, 0, count($filters)-1);
        foreach($filtersButLast as $filter) {

            if(class_implements_interface($filter, FormatFilterInterface::class))
                throw new \Exception("Only last filter must implement \"".FormatFilterInterface::class."\"");
        }

        $pathRelative = $this->filesystem->stripPrefix(realpath($path), $config["storage"] ?? null);
        $pathSuffixes = array_map(fn ($f) => is_stringeable($f) ? strval($f) : null, $filters);
        $pathCache = path_suffix($pathRelative, $pathSuffixes);

        //
        // Compute a response.. (if cache not found)
        if ($config["local_cache"] ?? false) {

            $localCache = array_pop_key("local_cache", $config);
            if(!is_string($localCache)) $localCache = $this->localCache;

            if(!$this->filesystem->fileExists($pathCache, "local.cache")) {

                $filteredPath = $this->filter($path, $filters, $config) ?? $path;

                $this->filesystem->mkdir(dirname($pathCache), "local.cache");
                $this->filesystem->write($pathCache, file_get_contents($filteredPath), "local.cache");

                if($formatter->getPath() === null) unlink_tmpfile($filteredPath);
            }

            return $this->filesystem->prefixPath($pathCache, "local.cache");
        }

        //
        // Use proper imagine service depending on the format
        $imagine = $formatter instanceof SvgFilter ? $this->imagineSvg : $this->imagineBitmap;

        //
        // GD does not support other palette than RGB..
        //if($this->imagine instanceof \Imagine\Gd\Imagine && is_cmyk($pathPublic))
        //   cmyk2rgb($pathPublic); // Not working yet..
        try { $image = $imagine->open($path); }
        catch (Exception $e) { return null; }

        if($formatter instanceof BitmapFilter) // Take care to set proper palette
            $image->usePalette(is_cmyk($path) ? new CMYK() : new RGB());

        foreach ($filters as $filter) // Apply filters
            $image = $filter->apply($image);

        return $formatter->getPath();
    }
}
