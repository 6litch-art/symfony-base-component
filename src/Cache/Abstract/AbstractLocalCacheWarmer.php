<?php

namespace Base\Cache\Abstract;

use Base\BaseBundle;
use Symfony\Bundle\FrameworkBundle\CacheWarmer\AbstractPhpFileCacheWarmer;
use Symfony\Component\Cache\Adapter\ArrayAdapter;

abstract class AbstractLocalCacheWarmer extends AbstractPhpFileCacheWarmer implements AbstractLocalCacheWarmerInterface
{
    /** @var string|null */
    private ?string $cacheFile;

    protected int $shellVerbosity = 0;

    /** @var ?AbstractLocalCacheInterface */
    protected ?AbstractLocalCacheInterface $simpleCache;

    protected ArrayAdapter $arrayAdapter;
    public function __construct(AbstractLocalCacheInterface $simpleCache, string $cacheDir)
    {
        $this->shellVerbosity = getenv('SHELL_VERBOSITY');

        $this->simpleCache = $simpleCache;
        $this->cacheFile = $cacheDir . '/pools/simple/php/' . str_replace(['\\', '/'], ['__', '_'], get_class($simpleCache)) . '.php';

        parent::__construct($this->cacheFile);
    }

    public function getCache(): ArrayAdapter
    {
        return $this->arrayAdapter;
    }

    public function isOptional(): bool
    {
        return false;
    }

    protected function doWarmUp(string $cacheDir, ArrayAdapter $arrayAdapter): bool
    {
        if (!BaseBundle::USE_CACHE) {
            return false;
        }
        if (!$this->cacheFile) {
            return false;
        }

        if (is_file($this->cacheFile)) {
            return false;
        }

        if ($this->shellVerbosity > 0 && 'cli' == php_sapi_name()) {
            echo ' // Warming up cache... ' . ucwords(camel2snake(str_replace('CacheWarmer', '', class_basename(static::class)), ' ')) . PHP_EOL . PHP_EOL;
        }

        $this->simpleCache?->setCache($arrayAdapter);
        $this->simpleCache?->warmUp($cacheDir);

        return true;
    }
}
