<?php

namespace Base\Service;

use Base\Filter\Advanced\ThumbnailFilter;
use Base\Filter\LastFilterInterface;
use Exception;
use Hashids\Hashids;
use Imagine\Filter\FilterInterface;
use Imagine\Image\ImageInterface;
use Imagine\Image\ImagineInterface;
use Imagine\Image\Palette\CMYK;
use Imagine\Image\Palette\RGB;
use Symfony\Bridge\Twig\Extension\AssetExtension;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mime\MimeTypes;
use Symfony\Component\Routing\RouterInterface;
use Twig\Environment;

class ImageService implements ImageServiceInterface
{
    /**
     * @var ImagineInterface
     */
    protected $imagine;

    /**
     * @var Filesystem
     */
    protected $filesystem;

    /**
     * @var MimeTypes
     */
    protected static $mimeTypes;

    public function __construct(Environment $twig, AssetExtension $assetExtension, RouterInterface $router, ParameterBagInterface $parameterBag, ImagineInterface $imagine, Filesystem $filesystem)
    {
        $this->projectDir = dirname(__FILE__, 6);
        $this->publicDir  = $this->projectDir."/public";
        $this->twig       = $twig;
        $this->assetExtension    = $assetExtension;
        $this->imagine    = $imagine;
        $this->router     = $router;
        $this->filesystem = $filesystem->set("local.cache");

        $this->maxQuality = $parameterBag->get("base.image.max_quality") ?? 1;
        $this->enableWebp = $parameterBag->get("base.image.enable_webp") ?? true;
        $this->noImage    = $parameterBag->get("base.image.no_image") ?? null;

        $this->hashIds = new Hashids($parameterBag->get("kernel.secret"));
        self::$mimeTypes = new MimeTypes();
    }

    public function getMaximumQuality() { return $this->maxQuality; } 
    public function isWebpEnabled() { return $this->enableWebp; }

    protected $hashIds;
    public function encode(array $array): string { return $this->hashIds->encodeHex(bin2hex(serialize($array))); }
    public function decode(string $hash): mixed  { return unserialize(hex2bin($this->hashIds->decodeHex($hash))); }

    public function webp   (array|string|null $path, array $filters = [], array $config = []): array|string|null { return $this->resolve("ux_webp", $path, $filters, $config); }
    public function image  (array|string|null $path, array $filters = [], array $config = []): array|string|null { return $this->resolve("ux_image", $path, $filters, $config); }
    public function imagine(array|string|null $path, array $filters = [], array $config = []): array|string|null { return browser_supports_webp() ? $this->webp($path, $filters, $config) : $this->image($path, $filters, $config); }

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

    public static $i = 0;
    public function resolve(string $route, array|string|null $source, array $filters = [], array $config = []): array|string|null
    {
        if(!$source) return $source;
        if(is_array($source)) return array_map(fn($s) => $this->resolve($route, $s, $filters, $config), $source);

        $path = "imagine/".str_strip($source, $this->assetExtension->getAssetUrl(""));

        $config["path"] = $path;
        $config["options"] = array_merge(["quality" => $this->getMaximumQuality()], $config["options"] ?? []);
        if(!empty($filters)) $config["filters"] = $filters;

        // Config convolution
        while ( ($sourceConfig = $this->decode(basename($source))) ) {

            $source = $sourceConfig["path"] ?? $source;
            $config["path"] = $source;
            $config["filters"] = ($sourceConfig["filters"] ?? []) + ($config["filters"] ?? []);
            $config["options"] = ($sourceConfig["options"] ?? []) + ($config["options"] ?? []);
        }

        return $this->router->generate($route, ["hashid" => $this->encode($config)]);
    }

    /**
     * Check if a JPEG image file uses the CMYK colour space.
     * @param string $path The path to the file.
     * @return bool
     */
    function isCMYK($path) 
    {
        if(!$path || !file_exists($path)) 
            return false;

        $imagesize = @getimagesize($path);
        return array_key_exists('mime', $imagesize) && 'image/jpeg' == $imagesize['mime'] &&
               array_key_exists('channels', $imagesize) && 4 == $imagesize['channels'];
    }

    public function getPublic(?string $path) { return $path !== null ? $this->publicDir."/".str_strip($path, [$this->publicDir, "imagine/"]) : null; }
    public function filter(?string $path, array $filters = []): Response
    {
        $content = null;
        $publicPath = null;

        $filters = array_filter($filters, fn($f) => class_implements_interface($f, FilterInterface::class));
        
        $lastFilter = array_slice($filters, -1, 1)[0] ?? null;
        if($lastFilter !== null) {
            
            if(!class_implements_interface($lastFilter, LastFilterInterface::class))
            throw new \Exception("Last filter \"".($lastFilter ? get_class($lastFilter) : null)."\" must implement \"".LastFilterInterface::class."\"");
            
            $filters = array_slice($filters, 0, count($filters)-1);
            foreach($filters as $filter) {
                
                if(!class_implements_interface($filters, LastFilterInterface::class))
                throw new \Exception("Only last filter must implement \"".LastFilterInterface::class."\"");
            }

            $pathSuffixes = array_map(fn ($f) => is_stringeable($f) ? strval($f) : null, $filters+[$lastFilter]);
            $publicPath = $this->getPublic($path);
            $path = path_suffix($path, $pathSuffixes);

            // Handle null path case
            if ($path === null) {
                $path = $this->noImage;
                $publicPath = $this->getPublic($this->noImage);
            }
            
            // Cache not found
            if (!$this->filesystem->getOperator()->fileExists($path)) {
                
                /**
                 * @var ImageInterface
                 */
                try {
                    $image = $this->imagine->open($publicPath);
                } catch (Exception $e) {
                    $publicPath = $this->getPublic($this->noImage);
                    $image = $this->imagine->open($publicPath);
                }

                $image->usePalette($this->isCMYK($publicPath) ? new CMYK() : new RGB());

                foreach ($filters+[$lastFilter] as $filter) {
                    $image = $filter->apply($image);
                }

                $this->filesystem->mkdir(dirname($path));

                $content = $image->get(self::extension($lastFilter->getPath()));
                $content = $this->filesystem->write($path, $content);
            }
        }

        $content = $path == $publicPath ? @file_get_contents($path) : $this->filesystem->read($path);
        $mimetype = $this->getMimetype($publicPath);

        $response = new Response();
        $response->setContent($content);
        
        $response->setMaxAge(365*24*3600);
        $response->setPublic();
        $response->setEtag(md5($response->getContent()));

        $response->headers->addCacheControlDirective('must-revalidate', true);
        $response->headers->set('Content-Type', $mimetype);

        return $response;
    }

    public function getMimeType(string $path):?string { return self::mimetype($this->getPublic($path)) ?? $this->filesystem->mimetype($path); }
    public static function mimetype(null|string|array $fileOrArray):null|string|array  {

        if(is_array($fileOrArray)) return array_map(fn($f) => self::mimetype($f), $fileOrArray);

        if(file_exists($fileOrArray))
            return image_type_to_mime_type(exif_imagetype($fileOrArray));

        try { return self::$mimeTypes->guessMimeType($fileOrArray); }
        catch (Exception $e) { return null; }
    }

    public function getExtension(string $path):null|string|array  { return self::extension($this->getMimeType($path)); }
    public static function extension(null|string|array $mimetypeOrFileOrArray):null|string|array 
    {
        if(is_array($mimetypeOrFileOrArray))
            return array_filter(array_map(fn($mimetype) => self::extension($mimetype), $mimetypeOrFileOrArray));


        if(!$mimetypeOrFileOrArray) return null;
        if(file_exists($mimetypeOrFileOrArray)) {

            $imagetype = exif_imagetype($mimetypeOrFileOrArray);
            return $imagetype ? substr(image_type_to_extension($imagetype), 1) : null;
        }

        return self::$mimeTypes->getExtensions($mimetypeOrFileOrArray)[0] ?? null;
    }

    public static function extensions(null|string|array $mimetypeOrArray):null|string|array 
    {
        if(!$mimetypeOrArray) return [];
        if(is_array($mimetypeOrArray)) {

            $extensions = [];
            $extensionList = array_map(function($mimetype) { return self::extensions($mimetype); }, $mimetypeOrArray);
            foreach ( $extensionList as $extension )
                $extensions = array_merge($extensions,$extension);

            return array_unique($extensions);
        }

        return self::$mimeTypes->getExtensions($mimetypeOrArray);
    }

    public function imagify(null|array|string $path, array $attributes = []): string
    {
        if(!$path) return $path;
        if(is_array($path)) return array_map(fn($p) => $this->imagify($p), $path);

        if($attributes["src"] ?? false)
            unset($attributes["src"]);

        return "<img ".html_attributes($attributes)." src='".$path."' />";
    }
}