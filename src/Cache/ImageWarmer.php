<?php

namespace Base\Cache;

use Symfony\Component\HttpKernel\CacheWarmer\CacheWarmerInterface;

class ImageWarmer implements CacheWarmerInterface
{
    public function __construct() { $this->shellVerbosity = getenv("SHELL_VERBOSITY"); }

    public function isOptional():bool { return true; }
    public function warmUp($cacheDir): array
    {
        if($this->shellVerbosity > 0 && php_sapi_name() == "cli")
            echo " // Warming up cache... Image & crops".PHP_EOL.PHP_EOL;

        return [];
    }
}