<?php

namespace Base\Service\Traits;

use Base\Entity\Sitemap\Setting;

use Doctrine\DBAL\Exception\TableNotFoundException;

trait BaseSettingsTrait
{
    protected $cache = null;

    protected $settingRepository = null;
    protected $settings = [];

    public function isCli() { return (php_sapi_name() == "cli"); }
    protected function isCacheEnabled() 
    {
        if(!self::__CACHE__) return false;
        if(!$this->cache)    return false;
        if($this->isCli())   return false;

        return true;
    }

    protected function read(string $name, array $normSettings)
    {
        $nameArray = explode(".", $name);
        foreach ($nameArray as $index => $key) {
        
            if($key == "_self" && $index != count($nameArray)-1)
                throw new \Exception("Failed to read \"$name\": _self can only be used as tail parameter");

            if(!array_key_exists($key, $normSettings))
                throw new \Exception("Failed to read \"$name\": key not found");

            $normSettings = &$normSettings[$key];
        }

        return $normSettings;
    }

    protected function normalize(string $name, array $settings) {

        $values = [];

        // Generate default structure
        $array = &$values;
        
        $nameArray = explode(".", $name);
        foreach ($nameArray as $index => $key) {
        
            if($key == "_self" && $index != count($nameArray)-1)
                throw new \Exception("Failed to normalize \"$name\": \"_self\" key can only be used as tail parameter");

            if(!array_key_exists($key, $array)) $array[$key] = ["_self" => null];
            $array = &$array[$key];
        }

        // Fill it with settings
        foreach($settings as $setting) {

            $array = &$values;
            foreach (explode(".", $setting->getName()) as $key)
                $array = &$array[$key];
            
            $array["_self"] = $setting;
        }

        return $values;
    }
    
    public function getRaw($name, ?string $locale = null)
    {
        if(!$name) return []; // Empty name is always returning empty data..

        if(is_array($names = $name)) {
            
            $settings = [];
            foreach($names as $name)
                $settings[] = $this->getRaw($name, $locale);

            return $settings;
        }

        try { $this->settings[$name] = $this->settings[$name] ?? $this->settingRepository->findByInsensitiveNameStartingWith($name)->getResult(); } 
        catch(TableNotFoundException $e) { return []; }

        $values = $this->normalize($name, $this->settings[$name]);
        $values = $this->read($name, $values); // get formatted values
        $this->applyCache($name, $locale, $values);
        return $values;
    }
    
    public function getRawScalar($name, ?string $locale = null)
    {
        if(is_array($names = $name)) {
            
            $settings = [];
            foreach($names as $name)
                $settings[] = $this->getRawScalar($name, $locale);

            return $settings;
        }

        return $this->getRaw($name, $locale)["_self"] ?? null;
    }

    public function getScalar($name, ?string $locale = null): string|object|null
    {
        if(is_array($names = $name)) {
            
            $settings = [];
            foreach($names as $name)
                $settings[] = $this->getScalar($name, $locale);

            return $settings;
        }

        if(($cacheValues = $this->getCache($name, $locale)))
            return ($cacheValues !== null ? $cacheValues["_self"] ?? null : null);

        $array = $this->getRawScalar($name, $locale);
       	return ($array ? $array->translate($locale)->getValue() ?? null : null);
    }

    public function get($name, ?string $locale = null): array
    {
        if(is_array($names = $name)) {

            $settings = [];
            foreach($names as $name)
                $settings[$name] = $this->get($name, $locale);

            return $settings;
        }

        if(($cacheValues = $this->getCache($name, $locale)))
            return $cacheValues;

        $values = $this->getRaw($name, $locale) ?? [];
        return array_map_recursive(fn($v) => ($v instanceof Setting ? $v->translate($locale)->getValue() : $v), $values);
    }

    public function set(string $name, $value, ?string $locale = null)
    {
        $this->removeCache($name);

        $setting = $this->getRaw($name, $locale)["_self"];
        if(!$setting instanceof Setting) {
        
            $setting = new Setting($name);
            $this->entityManager->persist($setting);
        }

        $setting->translate($locale)->setValue($value);
        $this->entityManager->flush();
        
        $this->removeCache($name);
        if($value = $this->get($name, $locale))
            $this->applyCache($name, $locale, $value);

        return $this;
    }

    public function has(string $name, ?string $locale = null)
    {
        return $this->get($name, $locale) !== null;
    }
    
    public function remove(string $name)
    {
        $this->removeCache($name);

        $this->settings[$name] = $this->settings[$name] ?? $this->settingRepository->findOneByInsensitiveName($name);
        if($this->settings[$name] instanceof Setting) {

            $this->entityManager->remove($this->settings[$name]);
            $this->entityManager->flush();    
        }

        return $this;
    }

    protected function getCache(string $name, ?string $locale) 
    {
        if(!$this->isCacheEnabled()) return null;

        $item = $this->cache->getItem($name);
        $itemList = $item->get() ?? [];

        $locale = $this->localeProvider->getLocale($locale);
        if (array_key_exists($locale, $itemList))
            return $itemList[$locale] ?? [];

        return null;
    }

    protected function applyCache(string $name, ?string $locale, $value)
    {
        dump($locale);
        if(!$value) return false;

        if(($setting = $value) instanceof Setting) 
            return $this->applyCache($name, $locale, $setting->translate($locale)->getValue());

        if(is_array( ($values = $value) )) {

            if(array_key_exists("_self", $values) && ($setting = $values["_self"]) instanceof Setting)
                $values["_self"] = $setting->translate($locale)->getValue();


            $item = $this->cache->getItem($name);
            $localeValues = array_merge($item->get() ?? [], [$locale => $values]);
            foreach($localeValues as $locale => $values) {

                // Broadcast cache storage
                foreach  ($values as $key => $innerValue) {

                    if($key == "_self") continue;
                    $this->applyCache($name.".".$key, $locale, $innerValue);
                }

                // Process current node
                $localeValues[$locale] = array_map_recursive(fn($v) => $v instanceof Setting ? $v->translate($locale)->getValue() : $v, $values);
            }

            if($this->isCacheEnabled()) $this->cache->save($item->set($localeValues));
            return true;
        }

        $item = $this->cache->getItem($name);
        $value = array_merge($item->get() ?? [], [$locale => $value]);
        if($this->isCacheEnabled()) $this->cache->save($item->set($value));

        return true;
    }
    
    public function removeCache(string $name)
    {
        unset($this->settings[$name]);
        foreach(array_reverse(explode(".", $name)) as $last) {
            
            if($this->isCacheEnabled()) $this->cache->delete($name);
            $name = substr($name, 0, strlen($name) - strlen($last) - 1);
        }

        return $this;
    }
}
