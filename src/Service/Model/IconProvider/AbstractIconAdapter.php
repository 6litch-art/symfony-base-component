<?php

namespace Base\Service\Model\IconProvider;

use Base\Cache\SimpleCache;
use Base\Service\Model\IconizeInterface;
use Symfony\Component\Yaml\Yaml;

abstract class AbstractIconAdapter extends SimpleCache implements IconAdapterInterface
{
    protected string $metadata;

    public function warmUp(string $cacheDir): bool
    {
        $this->contents = $this->getCache("/Contents", function() {

            if (file_exists($this->metadata)) {

                return  (str_ends_with($this->metadata, "yml") ?
                            Yaml::parse(file_get_contents($this->metadata)) :
                        (str_ends_with($this->metadata, "yaml") ?
                            Yaml::parse(file_get_contents($this->metadata)) :
                        (str_ends_with($this->metadata, "json") ?
                            json_decode(file_get_contents($this->metadata), true) : [])));
            }
        });

        return true;
    }

    protected $version;
    public function getVersion(): string { return $this->version ?? "unk."; }

    protected $contents = [];
    public function getContents() { return $this->contents; }

    public function getMetadata() { return $this->metadata; }
    public function getEntries() { return $this->contents ?? []; }
    public function getEntry(string $value = null): string { return $this->contents[$value] ?? ""; }

    public function iconify(IconizeInterface|string $icon, array $attributes = []): string
    {
        if ($icon instanceof IconizeInterface) {
            $icon = $icon->__iconize() ?? $icon->__iconizeStatic();
            $icon = first($icon);
        }

        $options = $this->getOptions();

        $class = trim(implode(" ", [$attributes["class"] ?? null, $options["class"] ?? null, $icon]));
        $class = implode(" ", array_unique(explode(" ", $class)));
        $attributes = array_key_removes($attributes, "class");

        return "<i ".html_attributes($attributes)." class='".$class."'></i>";
    }
}