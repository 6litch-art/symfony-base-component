<?php 

namespace {

    use Base\BaseBundle;

    function interpret_link($input)
    {
        return preg_replace_callback(
            "@
        (?:http|ftp|https)://
        (?:
            (?P<domain>\S+?) (?:/\S+)|
            (?P<domain_only>\S+)
        )
        @sx",
        function ($a) {
            $link = "<a href='" . $a[0] . "'>";
            $link .= $a["domain"] !== "" ? $a["domain"] : $a["domain_only"];
            $link .= "</a>";
            return $link;
        }, $input);
    }

    function is_instanceof(mixed $object_or_class, string $class): bool
    {
        if(!class_exists($class))
            throw new Exception("Class \"$class\" doesn't exists.");

        return is_a($object_or_class, $class, !is_object($object_or_class));
    }

    function is_url(?string $url): bool { return filter_var($url, FILTER_VALIDATE_URL); }
    function camel_to_snake(string $input, string $separator = "_") { return mb_strtolower(str_replace('.'.$separator, '.', preg_replace('/(?<!^)[A-Z]/', $separator.'$0', $input))); }
    function snake_to_camel(string $input, string $separator = "_") { return lcfirst(str_replace(' ', '', mb_ucwords(str_replace($separator, ' ', $input)))); }

    function is_uuid(string $uuid) { return is_string($uuid) && !(preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/', $uuid) !== 1); }
    function synopsis(...$args) { return class_synopsis(...$args); }
    function class_synopsis(...$args)
    {
        foreach($args as $object) {

            if (!$object) return dump("Object passed is null");
            $objectID = (is_object($object)) ? "Object: 0x" . spl_object_hash($object) . "\n" : "";

            if (!is_object($object) && !is_string($object)) return dump($object);

            $className    = (is_string($object) ? $object : get_class($object));
            if(!class_exists($className)) 
                return dump("Class \"$className\" not found.");
            
            $classParent  = get_parent_class($className);
            $classMethods = get_class_methods($className);
            $classVars    = get_class_vars($className);

            $classReflection = new \ReflectionClass($object);

            $methods = "";
            foreach ($classMethods as $methodName) {

                $params = (new \ReflectionMethod($className, $methodName))->getParameters();

                $args = "";
                foreach ($params as $param) {
                    $optional = ($param->isOptional()) ? " = optional" : "";
                    $args .= (!empty($args)) ? ", " : "";
                    $args .= "$" . $param->getName() . $optional;
                }

                $methods .= "\n     public function " . $methodName . "(" . $args . ") { ... }";
            }

            $vars = "";
            foreach ($classVars as $varName => $value) {

                $value = ( is_array($value)) ? print_r($value, true) : (
                            (is_object($value) && !method_exists($value, '__toString')) ? get_class($value)."(not is_stringeable)" : $value);

                $vars .= (!empty($vars)) ? ",\n" : "";
                $vars .= "     $" . $varName . " = \"" . $value . "\"";
            }

            if (empty($vars)) $vars = "     -- No public variable available";
            if (empty($methods)) $methods = "     -- No public method available";
            $parentName = (!empty($classParent)) ? "            extends " . $classParent : "";

            dump(
                $classReflection,
                $objectID .
                    "class " . $className . $parentName . " {\n\n" .
                    $vars . "\n" .
                    $methods . "\n}\n\nMore information in the ReflectionMethod below.."
            );
        }
    }

    define("SHORTEN_FRONT", -1); // [..] dolor sit amet
    define("SHORTEN_MIDDLE", 0); // Lorem ipsum [..] amet
    define("SHORTEN_BACK",   1); // Lorem ipsum dolor [..]
    function str_shorten(?string $str, int $length = 100, int $position = SHORTEN_BACK, string $separator = " [..] "): ?string
    {
        if($length == 0) return "";

        $nChr = strlen($str);

        if($nChr == 0) return "";
        if($nChr > $length + strlen($separator)) {

            switch($position) {
                
                case SHORTEN_FRONT:
                    return ltrim($separator) . substr($str, $nChr, $length+1);

                case SHORTEN_MIDDLE:
                    return substr($str, 0, $length/2). $separator . substr($str, $nChr-$length/2, $length/2+1);

                case SHORTEN_BACK:
                    return substr($str, 0, $length) . rtrim($separator);
            }
        }

        return $str;
    }

    function random_str(int $length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    const     BIT_PREFIX = array("b");
    const    BYTE_PREFIX = array("B", "O", "o");
    const  BINARY_PREFIX = array("", "ki", "mi", "gi", "ti", "pi", "ei", "zi", "yi");
    const DECIMAL_PREFIX = array("", "k",  "m",  "g",  "t",  "p",  "e",  "z",  "y");

    function byte2bit(int $num): int { return 8*$num; } // LMFAO !
    function bit2byte(int $num): int { return $num/8; } // LMFAO !
    function byte2str(int $num, array $unitPrefix = DECIMAL_PREFIX): string { return dec2str($num/8, $unitPrefix).BYTE_PREFIX[0]; }
    function  bit2str(int $num, array $unitPrefix = DECIMAL_PREFIX): string { return dec2str($num, $unitPrefix).BIT_PREFIX[0]; }
    function  dec2str(int $num, array $unitPrefix = DECIMAL_PREFIX): string
    {
             if ($unitPrefix == DECIMAL_PREFIX) $divider = 1000;
        else if ($unitPrefix == BINARY_PREFIX)  $divider = 1024;
        else throw new \Exception("Unknown prefix found: \"$unitPrefix\"");
        $unitPrefix = [''] + $unitPrefix;

        $factor   = (int) floor(log($num) / log($divider));
        $quotient = (int) ($num / ($divider ** $factor));

        $rest     = $num - $divider*$quotient;
        if($rest < 0) $factor--;

        $quotient = (int) ($num / ($divider ** $factor));
        return strval($factor > 0 ? $quotient.@mb_ucfirst($unitPrefix[$factor]) : $num);
    }

    function str2dec(string $str): int
    {
        $val = trim($str);
        if(!preg_match('/^([bo]{0,2})([a-z]{0,2})([0-9]*)/i', strrev($val), $matches))
            throw new \Exception("Failed to parse string \"".$str."\"");
        
        $val        = intval($matches[3] == "" ? 1 : strrev($matches[3]));
        $unitPrefix = mb_strtolower(strrev($matches[2]));
        $units      = strrev($matches[1]);

        if(in_array($units,  BIT_PREFIX)) $val *= 1; // LMFAO !
        if(in_array($units, BYTE_PREFIX)) $val *= 8;
        if ($unitPrefix) {

            $binFactor = array_search($unitPrefix, BINARY_PREFIX);
            $decFactor = array_search($unitPrefix, DECIMAL_PREFIX);
            if( ! (($decFactor !== false) xor ($binFactor !== false)) )
                throw new \Exception("Unexpected prefix unit \"$unitPrefix\" for \"".$str."\"");

            if($decFactor !== false) $val *= 1000**($decFactor);
            if($binFactor !== false) $val *= 1024**($binFactor);
        }
        
        return intval($val);
    }

    function get_depth_class($object_or_class): int
    {
        if(!get_parent_class($object_or_class)) return 0;
        return get_depth_class(get_parent_class($object_or_class)) + 1;
    }
    
    function property_declarer($object_or_class, string $property): ?string 
    {
        $class = is_object($object_or_class) ? get_class($object_or_class): $object_or_class;

        $reflProperty = new ReflectionProperty($class, $property);
        return $reflProperty->getDeclaringClass()->getName();
    }

    function method_declarer($object_or_class, string $method): ?string 
    {
        $class = is_object($object_or_class) ? get_class($object_or_class): $object_or_class;
        
        $reflMethod = new ReflectionMethod($class, $method);
        return $reflMethod->getDeclaringClass()->getName();
    }

    function path_suffix(string|array|null $path, $suffix, $separator = "_"): string|array|null
    {
        if($path === null) return $path;
     
        if(!is_array($suffix)) $suffix = [$suffix];
        $suffix = implode($separator, array_filter($suffix));
     
        if(is_array($path))
            return array_map(fn($p) => path_suffix($p, $suffix, $separator), $path);
        
        $path = pathinfo($path);
        $path["dirname"] = $path["dirname"] ?? null;
        if($path["dirname"]) $path["dirname"] .= "/";
        $path["extension"] = $path["extension"] ?? null;
        if($path["extension"]) $path["extension"] = ".".$path["extension"];

        $filename = $path["filename"] ?? null;
        $suffix = ($filename && $suffix) ? $separator.$suffix : $suffix;
        return $path["dirname"].$path["filename"].$suffix.$path["extension"];
    }
    
    function path_prefix(string|array|null $path, $prefix, $separator = "_"): string|array|null
    {
        if($path === null) return $path;
     
        if(!is_array($prefix)) $prefix = [$prefix];
        $prefix = implode($separator, array_filter($prefix));

        if(is_array($path))
            return array_map(fn($p) => path_prefix($p, $prefix, $separator), $path);
        
        $path = pathinfo($path);
        $path["dirname"] = $path["dirname"] ?? null;
        if($path["dirname"]) $path["dirname"] .= "/";
        $path["extension"] = $path["extension"] ?? null;
        if($path["extension"]) $path["extension"] = ".".$path["extension"];

        $filename = $path["filename"] ?? null;
        $prefix = ($filename && $prefix) ? $separator.$prefix : $prefix;

        return $path["dirname"].$prefix.$path["filename"].$path["extension"];
    }

    function str_strip(?string $haystack, array|string $lneedle = " ", array|string $rneedle = " ", bool $recursive = true): ?string { return str_rstrip(str_lstrip($haystack, $lneedle, $recursive), $rneedle, $recursive); }
    function str_rstrip(?string $haystack, array|string $needle = " ", bool $recursive = true): ?string
    {
        if($haystack === null) return null; 
        if(is_array($needle)) {

            $_haystack = null;
            while($haystack != $_haystack) {

                $_haystack = $haystack;
                foreach($needle as $n)
                    $haystack = str_rstrip($haystack, $n);
            }

            return $haystack;
        }

        while(!empty($needle) && strlen($haystack) === strrpos($haystack, $needle)+strlen($needle)) {
            $haystack = substr($haystack, 0, strlen($haystack)-strlen($needle));
            if(!$recursive) break;
        }

        return $haystack;
    }

    function str_lstrip(?string $haystack, array|string $needle = " ", bool $recursive = true): ?string
    {
        if($haystack === null) return null; 
        if(is_array($needle)) {

            $_haystack = null;
            while($haystack != $_haystack) {

                $_haystack = $haystack;
                foreach($needle as $n)
                    $haystack = str_lstrip($haystack, $n);
            }

            return $haystack;
        }

        while(!empty($needle) && 0 === strpos($haystack, $needle)) {
            $haystack = substr($haystack, strlen($needle));
            if(!$recursive) break;
        }

        return $haystack;
    }

    function first(object|array &$array) { return begin($array) ?? false; }
    function last(object|array &$array)  { return end($array)   ?? false; }

    function begin(object|array &$array) 
    {
        $first = array_key_first($array);
        return $first !== null ? $array[$first] : null;
    }

    function head(object|array &$array):mixed { return array_slice($array, 0, 1)[0] ?? null; }
    function tail(object|array &$array, int $offset = 1):array  { return array_slice($array, $offset); }

    function distance(array $arr1, array $arr2)
    { 
        $min = min(count($arr1), count($arr2));
        if($min == count($arr1))
            $arr2 = array_pad($arr2, $min, 0);
        if($min == count($arr2))
            $arr1 = array_pad($arr1, $min, 0);

        return sqrt(array_sum(array_map(fn($d1, $d2) => (intval($d1) - intval($d2)) * (intval($d1) - intval($d2)), $arr1, $arr2)));
    }
    
    function fread2($handle, int $bytes = 1, int $rollback = 0): ?string
    {
        if(!$handle) return null;
        $ftell = ftell($handle);
        if($rollback)
            fseek($handle, $ftell-$rollback);

        return fread($handle, $bytes);
    }

    function digits(int $num, int $ndigits): string
    {
        $str = strval($num);

        $length = strlen($str);
        for($i = $length; $i < $ndigits; $i++)
            $str = '0'.$str;

        return $str;
    }

    function closest(array $array, $position = -1) { return $array[$position] ?? ($position < 0 ? ($array[0] ?? false) : end($array)); }
    function is_html(?string $str)  { return $str != strip_tags($str); }
    function is_stringeable($value) { return (!is_object($value) && !is_array($value)) || ((is_string($value) || is_object($value)) && method_exists($value, '__toString')); }
    function tmpfile2(string $extension = "", string $suffix = "", string $prefix = "")
    {
        $extension = $extension ? '.'.$extension : "";
        $fname = tempnam(sys_get_temp_dir(), $prefix);
        rename($fname, $fname .= $suffix . $extension);

        return fopen($fname, "w");
    }

    function get_alias(array|object|string|null $arrayOrObjectOrClass): string
    {
        if(!$arrayOrObjectOrClass) return $arrayOrObjectOrClass;
        if(is_array($arrayOrObjectOrClass))
            return array_map(fn($a) => get_alias($a), $arrayOrObjectOrClass);

        $arrayOrObjectOrClass = is_object($arrayOrObjectOrClass) ? get_class($arrayOrObjectOrClass) : $arrayOrObjectOrClass;
        if(!class_exists($arrayOrObjectOrClass)) return false;

        return BaseBundle::getAlias($arrayOrObjectOrClass);
    }

    function alias_exists(array|object|string|null $arrayOrObjectOrClass): bool
    {
        if(!$arrayOrObjectOrClass) return $arrayOrObjectOrClass;
        if(is_array($arrayOrObjectOrClass))
            return array_map(fn($a) => alias_exists($a), $arrayOrObjectOrClass);

        $class = is_object($arrayOrObjectOrClass) ? get_class($arrayOrObjectOrClass) : $arrayOrObjectOrClass;
        if(!class_exists($class)) return false;

        return BaseBundle::getAlias($class) != $class;
    }

    function class_implements_interface(array|object|string|null $arrayOrObjectOrClass, $interface)
    {
        if(!$arrayOrObjectOrClass) return $arrayOrObjectOrClass;
        if(is_array($arrayOrObjectOrClass))
            return array_map(fn($a) => class_implements_interface($a, $interface), $arrayOrObjectOrClass);

        $class = is_object($arrayOrObjectOrClass) ? get_class($arrayOrObjectOrClass) : $arrayOrObjectOrClass;
        if(!class_exists($class)) return false;

        $classImplements = class_implements($class); 
        return array_key_exists($interface, $classImplements);
    }

    function class_name(array|object|string|null $arrayOrObjectOrClass) { return class_basename($arrayOrObjectOrClass); }
    function class_basename(array|object|string|null $arrayOrObjectOrClass)
    {
        if(!$arrayOrObjectOrClass) return $arrayOrObjectOrClass;
        if(is_array($arrayOrObjectOrClass))
            return array_map(fn($a) => class_basename($a), $arrayOrObjectOrClass);

        $class = is_object($arrayOrObjectOrClass) ? get_class($arrayOrObjectOrClass) : $arrayOrObjectOrClass;
        $class = explode("::", $class)[0];

        return str_replace("/", "\\", basename(str_replace('\\', '/', $class)));
    }

    function class_namespace(array|object|string|null $arrayOrObjectOrClass) { return class_dirname($arrayOrObjectOrClass); }
    function class_dirname(array|object|string|null $arrayOrObjectOrClass)
    {
        if(!$arrayOrObjectOrClass) return $arrayOrObjectOrClass;
        if(is_array($arrayOrObjectOrClass))
            return array_map(fn($a) => class_dirname($a), $arrayOrObjectOrClass);

        $class = is_object($arrayOrObjectOrClass) ? get_class($arrayOrObjectOrClass) : $arrayOrObjectOrClass;
        $dirname = str_replace("/", "\\", dirname(str_replace('\\', '/', $class)));
        return $dirname == "." ? "" : $dirname;
    }

    function is_cli(): bool { return (php_sapi_name() == "cli"); }
    function mb_ucfirst(string $string, ?string $encoding = null): string { return mb_strtoupper(mb_substr($string, 0, 1, $encoding)).mb_substr($string, 1, null, $encoding); }
    function mb_ucwords(string $string, ?string $encoding = null, string $separators = " \t\r\n\f\v"): string 
    { 
        $separators = str_split($separators);
        foreach($separators as $separator)  
            $string = implode($separator, array_map(fn($s) => mb_ucfirst($s, $encoding), explode($separator, $string)));

        return $string;
    }

    function html_attributes(array ...$attributes) 
    { 
        $attributes = array_merge(...$attributes); 
        return trim(implode(" ", array_map(fn($k) => trim($k)."=\"".trim($attributes[$k])."\"", array_keys(array_filter($attributes)))));
    }

    function browser_name()    : string { return get_browser2()["name"]; }
    function browser_platform(): string { return get_browser2()["platform"]; }
    function browser_version() : string { return get_browser2()["version"]; } 

    function get_browser2(?string $userAgent = null)
    {
        $userAgent = $userAgent ?? $_SERVER['HTTP_USER_AGENT'];
        
        $platform = "unknown";
        if (preg_match('/android/i', $userAgent))
            $platform = 'android';
        elseif (preg_match('/linux/i', $userAgent))
            $platform = 'linux';
        elseif (preg_match('/macintosh|mac os x/i', $userAgent))
            $platform = 'apple';
        elseif (preg_match('/windows|win32/i', $userAgent))
            $platform = 'windows';

        $name = "Unknown";
        if(preg_match('/MSIE/i',$userAgent) && !preg_match('/Opera/i',$userAgent))
            $name = "MSIE";
        else if(preg_match('/Firefox/i',$userAgent))
            $name = "Firefox";
        else if(preg_match('/OPR/i',$userAgent))
            $name = "Opera";
        else if(preg_match('/Chrome/i',$userAgent) && !preg_match('/Edge/i',$userAgent))
            $name = "Chrome";
        else if(preg_match('/Safari/i',$userAgent) && !preg_match('/Edge/i',$userAgent))
            $name = "Safari";
        else if(preg_match('/Netscape/i',$userAgent))
            $name = "Netscape";
        else if(preg_match('/Edge/i',$userAgent))
            $name = "Edge";
        else if(preg_match('/Trident/i',$userAgent))
            $name = "MSIE";

        $device = "computer";
        if (preg_match('/tablet|ipad/i', $userAgent))
            $device = 'tablet';
        else if (preg_match('/mobile|iphone|ipod/i', $userAgent))
            $device = 'mobile';


        $known = implode("|", ['Version', $name, 'other']);
        preg_match_all('#(?<browser>' . $known .')[/ ]+(?<version>[0-9.|a-zA-Z.]*)#', $userAgent, $matches);

        $version = "";
        if (count($matches['browser']) == 1) $version = $matches['version'][0];
        else {

            //we will have two since we are not using 'other' argument yet
            //see if version is before or after the name
            if (strripos($userAgent,"Version") < strripos($userAgent,$name)) $version = $matches['version'][0];
            else $version = $matches['version'][1];
        }

        if (!$version) $version = "?";

        return [
            'user_agent' => $userAgent,
            'name'       => $name,
            'version'    => $version,
            'device'     => $device,
            'platform'   => $platform
        ];
    }

    function array_concat(array ...$arrays): array {

        $array = [];
        foreach($arrays as $arr)
            foreach($arr as $key => $element) $array[] = $element;

        return $array;
    }

    function array_clear(array &$array) { while(array_pop($array)) {} }

    function array_prepend(array &$array, ...$value):int { return array_unshift($array, ...array_map(fn($v) => $v !== null && !is_array($v) ? [$v] : $v, $value)); }
    function array_append(array &$array, ...$value):int { return array_push($array, ...array_map(fn($v) => $v !== null && !is_array($v) ? [$v] : $v, $value)); }
    function array_append_recursive()
    {
        $arrays = func_get_args();
        $base = array_shift($arrays);

        if (!is_array($base)) $base = empty($base) ? array() : array($base);

        foreach ($arrays as $append) {
            if (!is_array($append)) $append = array($append);
            foreach ($append as $key => $value) {

                if (!array_key_exists($key, $base) and !is_numeric($key)) {
                    $base[$key] = $append[$key];
                    continue;
                }

                if (is_array($value) or is_array($base[$key])) {
                    $base[$key] = array_append_recursive($base[$key], $append[$key]);
                } else if (is_numeric($key)) {
                    if (!in_array($value, $base)) $base[] = $value;
                } else {
                    $base[$key] = $value;
                }
            }
        }

        return $base;
    }

    function browser_supports_webp(): bool
    {
        if(strpos( $_SERVER['HTTP_ACCEPT'] ?? [], 'image/webp' ) !== false)
            return true;

        if(browser_name() == "Safari" && version_compare("14.0", browser_version()) < 0)
            return true;
        if(browser_name() == "Chrome" && version_compare("23.0", browser_version()) < 0)
            return true;
        if(browser_name() == "Firefox" && version_compare("65.0", browser_version()) < 0)
            return true;
        if(browser_name() == "Edge" && version_compare("1809", browser_version()) < 0)
            return true;
        if(browser_name() == "Opera" && version_compare("12.1", browser_version()) < 0)
            return true;

        return false;
    }

    function array_insert(array $array, bool|int|string $index = false, ...$val): array
    {
        $keys = array_keys($array);

        $pos  = $index === false ? false : array_search($index, $keys, true);
        if($pos === false) $pos = count($array);

        return array_merge(array_slice($array, 0, $pos), $val, array_slice($array, $pos));
    }

    function next_key(array $array, $key): mixed
    {
        $keys = array_keys($array);

        $position = array_search($key, $keys);
        if (isset($keys[$position + 1]))
            return $keys[$position + 1];

        return false;
    }
    
    function pathinfo_relationship(string $path)
    {
        $extension = pathinfo(parse_url($path, PHP_URL_PATH), PATHINFO_EXTENSION);
        if(empty($extension)) return null;
        
        switch($extension) {

            case "ico": return "icon";
            case "css": return "stylesheet";
            case "js": return "javascript";

            default: return "preload";
        }
    }

    function is_associative(array $arr): bool
    {
        if(!$arr) return false;

        $keys = array_keys($arr);
        foreach($keys as $key)
            if(gettype($key) != "integer") return true;

        return $keys !== range(0, count($arr) - 1);
    }

    function array_is_nested($a)
    {
        $rv = array_filter($a, 'is_array');
        if (count($rv) > 0) return true;
        return false;
    }

    function array_replace_keys($array, array|string|int $old, array|string|int $new) {

        if(gettype($old) == "array" && gettype($new) == "array") {

            foreach($old as $i => $_)
                $array = array_replace_keys($array, $old[$i], $new[$i]);

            return $array;
        
        } else if(gettype($old) == "array" || gettype($new) == "array") {

            if(gettype($new) != gettype($old))
                throw new \Exception(__FUNCTION__."() : Argument #2 (\$new) must be of same type as argument #1 (\$old)");
        }

        $keys = array_keys($array);
        $idx  = array_search($old, $keys);
        
        array_splice($keys, $idx, 1, $new);
        return array_combine($keys, array_values($array));
    }

    function array_map_recursive(callable $callback, array $array) :array {

        $func = function ($item) use (&$func, &$callback) {
            return is_array($item) ? array_map($func, $item) : call_user_func($callback, $item);
        };

        return array_map($func, $array);
    }

    function count_leaves(array $array)
    {
        $counter = 0;
        array_map_recursive(function($k) use (&$counter) { $counter++; }, $array);
        return $counter;
    }

    define("FORMAT_IDENTITY",     0); // "no changes"
    define("FORMAT_TITLECASE",    1); // Lorem Ipsum Dolor Sit Amet
    define("FORMAT_SENTENCECASE", 2); // Lorem ipsum dolor sit amet
    define("FORMAT_LOWERCASE",    3); // lorem ipsum dolor sit amet
    define("FORMAT_UPPERCASE",    4); // LOREM IPSUM DOLOR SIT AMET
    
    function castcase(string $str, int $format = 0): string
    {
        switch($format) {

            case FORMAT_TITLECASE:
                return mb_ucwords($str);
                break;

            case FORMAT_SENTENCECASE:
                return mb_ucfirst(mb_strtolower($str));
                break;

            case FORMAT_LOWERCASE:
                return mb_strtolower($str);
                break;

            case FORMAT_UPPERCASE:
                return mb_strtoupper($str);
                break;

            default:
            case FORMAT_IDENTITY:
                return $str;
        }
    }

    function array_transforms(callable $callback, array $array, int $depth = 0): array {

        $reflection = new ReflectionFunction($callback);
        if (!$reflection->getReturnType() || !in_array($reflection->getReturnType()->getName(), ['array', 'Generator'])) 
            throw new \Exception('Callable function must use "array" or "Generator" return type');
    
        $tArray = [];
        $counter = 0;
        foreach($array as $key => $entry) {
        
            switch($reflection->getNumberOfParameters()) {
                case 0:
                    throw new InvalidArgumentException('Missing arguments in the callable function (must be between 1 and 4)');

                case 1:
                    $ret = call_user_func($callback, $key);
                    break;

                case 2:
                    $ret = call_user_func($callback, $key, $entry);
                    break;

                case 3:
                    $ret = call_user_func($callback, $key, $entry, $callback);
                    break;

                case 4:
                    $ret = call_user_func($callback, $key, $entry, $callback, $counter);
                    break;

                case 5:
                    $ret = call_user_func($callback, $key, $entry, $callback, $counter, $depth);
                    break;
            
                default:
                    throw new InvalidArgumentException('Too many arguments passed to the callable function (must be between 1 and 4)');
            }

            if($ret instanceof Generator) {

                foreach($ret as $key => $yield)
                    $tArray[!empty($key) ? $key : count($tArray)] = $yield;
               
                $ret = $ret->getReturn();
            }

            if($ret === null) continue;

            list($tKey, $tEntry) = [$ret[0] ?? count($tArray), $ret[1] ?? $entry];
            $tArray[$tKey] = $tEntry;

            $counter++;
        }

        return $tArray;
    }

    function array_filter_recursive(array $array, ?callable $callback = null, int $mode = 0) { return array_transforms(fn($k,$v,$fn):?array => [$k, is_array($v) ? array_transforms($fn, array_filter($v, $callback, $mode)) : $v], $array); }
    function array_slice_recursive(array $array, int $offset, ?int $length, bool $preserve_keys = false): array
    {
        $offsetCounter = 0;
        $lengthCounter = 0;

        return array_transforms(function($k, $v, $callback, $i) use ($preserve_keys, &$offsetCounter, $offset, &$lengthCounter, $length):?array {

            if(is_array($v)) {

                $v = array_transforms($callback, $v);
                $array = empty($v) ? null : [$preserve_keys ? $k : $i, $v];
                return $array;
            }

            $array = ($offsetCounter < $offset || ($lengthCounter >= $length)) ? null : [$preserve_keys ? $k : $i, $v];
            if($array !== null) $lengthCounter++;

            $offsetCounter++;
            return $array;

        }, $array);

    }

    define('ARRAY_FLATTEN_PRESERVE_KEYS', 1);
    define('ARRAY_FLATTEN_PRESERVE_DUPLICATES', 2);
    function array_flatten(?array $array = null, int $mode = 0)
    {
        $result = [];
        if (!is_array($array)) $array = func_get_args();

        foreach ($array as $key => $value) {
        
            switch($mode) {

                case ARRAY_FLATTEN_PRESERVE_KEYS:
                    $flattenValues = is_array($value) ? array_flatten($value, $mode) : $value;
                    if(!is_array($flattenValues)) $result[$key] = $value;
                    else {
                        
                        foreach($flattenValues as $key2 => $flattenValue)
                            $result[$key.".".$key2] = $flattenValue;
                    }

                    break;

                case ARRAY_FLATTEN_PRESERVE_DUPLICATES:
                    $flattenValues = is_array($value) ? array_flatten($value) : [$key => $value];
                    foreach($flattenValues as $key2 => $flattenValue) {

                        if(!array_key_exists($key2, $result)) $result[$key2] = [$flattenValue];
                        else $result[$key2][] = $flattenValue;
                    }
                    break;

                default: case 0: 
                    $flattenValues = is_array($value) ? array_flatten($value) : [$key => $value];
                    $result = array_merge($result, $flattenValues);
            }
        }

        return $result;
    }

    function array_class($objectOrClass, array $haystack): string|int|false 
    {
        $className = is_object($objectOrClass) ? get_class($objectOrClass) : $objectOrClass;
        foreach($haystack as $key => $item)
            if($item instanceof $className) return $key;

        return false;
    }

    function array_class_last($objectOrClass, array $haystack): string|int|false 
    {
        $haystack = array_reverse($haystack);
        if(is_associative($haystack)) 
            return array_class($objectOrClass, $haystack);

        $position = array_class($objectOrClass, $haystack);
        if($position === false) return false;

        return count($haystack) - $position - 1;
    }

    function array_search_last(mixed $needle, array $haystack, bool $strict = false): string|int|false 
    {
        $haystack = array_reverse($haystack);
        if(is_associative($haystack)) 
            return array_search($needle, $haystack, $strict);

        $position = array_search($needle, $haystack, $strict);
        if($position === false) return false;

        return count($haystack) - $position - 1;
    }

    function array_search_recursive(mixed $needle, array $haystack):array|false {

        foreach ($haystack as $key => $value) {

            if($value === $needle) return [$key];
            if( is_array($value) && ($current = array_search_recursive($needle, $value)) )
                return  array_merge([$key], $current);
        }

        return false;
    }

    function array_pop_key(mixed $key, array &$array): mixed 
    {
        if(empty($array)) return null;

        $entry = $array[$key] ?? null;
        $array = array_key_removes($array, $key);

        return $entry;
    }

    function array_key_removes  (array $array, string ...$keys  ): array
    { 
        foreach($keys as $key) 
            unset($array[$key]);

        return $array;
    }

    function array_values_remove(array $array, ...$values):array { return array_filter($array, fn($v) => !in_array($v, $values)); }
    function array_values_insert(array $array, ...$values):array 
    {
        foreach($values as $value)
            if(!in_array($value, $array)) $array[] = $value;
        
        return $array;
    }

    function array_values_insert_any(array $array, ...$values): array
    {
        foreach($values as $value)
            $array[] = $value;
        
        return $array;
    }

    function array_union(...$arrays): array
    {
        $union = [];
        foreach($arrays as $array)
            $union += $array;

        return $union;
    }

    function mailparse(string $addresses): array
    {
        $regex = '/(?:\w*:)*\s*(?:"([^"]*)"|([^,;\/""<>]*))?\s*(?:(?:[,;\/]|<|\s+|^)([^<@\s;,]+@[^>@\s,;\/]+)>?)\s*/';
        if (preg_match_all($regex, $addresses, $matches, PREG_SET_ORDER) > 0)
            $matches = array_transforms(fn($k, $x): array => [trim($x[3]), trim($x[1] . $x[2])], $matches);

        return $matches;
    }

    function array_unique_end($array) 
    {
        $len = count($array);
        return array_transforms(fn($k,$v):array => [$len-$k-1,$v], array_unique(array_reverse($array)));
    }

    function array_unique_map(callable $callback, array $array, int $flags = SORT_STRING): array
    {
        $arrayMask = array_fill_keys(array_keys(array_unique(array_map($callback, $array), $flags)), null);
        return array_intersect_key($array, $arrayMask);
    }

    function cast_from_array(array $array, string $newClass) { return unserialize(str_replace('O:8:"stdClass"','O:'.strlen($newClass).':"'.$newClass.'"',serialize((object) $array) )); }
    function cast_empty(string $newClass) { return unserialize(str_replace('O:8:"stdClass"','O:'.strlen($newClass).':"'.$newClass.'"', serialize((object) []) )); }
    function cast($object, $newClass, ...$args)
    {
        $reflClass      = new \ReflectionClass($object);
        $reflProperties = $reflClass->getProperties();

        $newObject    = new $newClass(...$args);
        $reflNewClass = new \ReflectionClass($newObject);
        foreach ($reflNewClass->getProperties() as $reflNewProperty) {

            $reflNewProperty->setAccessible(true);
            
            $reflProperty = array_filter($reflProperties, fn($p) => $p->getName() == $reflNewProperty->getName());
            $reflProperty = begin($reflProperty) ?? null;
            if ($reflProperty) {

                $reflProperty->setAccessible(true);

                $value = $reflProperty->getValue($object);
                $reflNewProperty->setValue($newObject, $value);
            }
        }

        return $newObject;
    }

    function is_serialized($string): bool { return is_string($string) && ($string == 'b:0;' || @unserialize($string) !== false); }
    function is_serializable($object): bool
    {
        try { serialize($object); }
        catch (Exception $e) { return false; }

        return true;
    }

    function hex2rgba(string $hex): array { return sscanf(strtoupper($hex), "#%02x%02x%02x%02x"); }
    function hex2rgb(string $hex): array { return sscanf(strtoupper($hex), "#%02x%02x%02x"); }
    function hex2hsl(string $hex): array { return rgb2hsl(hex2rgb($hex)); }
    function hex2int(string $hex):int { return hexdec(ltrim($hex, '#')); }
    
    function int2hex(int $int, bool $hash = true):string { return ($hash ? '#' : '').sprintf('%06X', $int); }
    function int2rgb(int $int):array { return [$int >> 16 & 0xFF, $int >> 8 & 0xFF, $int & 0xFF]; }
    function float2rgba(float $float):array { return [$float >> 24 & 0xFF, $float >> 16 & 0xFF, $float >> 8 & 0xFF, $float & 0xFF]; }
    
    function rgb2int(array $rgb) { return ($rgb[0] * 65536) + ($rgb[1] * 256) + ($rgb[2]); }
    function rgb2hex(array $rgb) :string { return sprintf("#%02X%02X%02X", ...array_pad($rgb,3,0)); }
    function rgba2float(array $rgba):float { return ($rgba[0] * 4294967296) + ($rgba[1] * 65536) + ($rgba[2] * 256) + ($rgba[3]); }
    function rgba2hex(array $rgba) :string { return sprintf("#%02X%02X%02X%02X", ...array_pad($rgba,4,0)); }

    function usort_column(array &$array, string $column, callable $fn):bool
    {
        return usort($array, fn($a1, $a2) => $fn($a1[$column] ?? null, $a2[$column] ?? null)); 
    }

    function hsl2hex(array $hsl) :string { return rgb2hex(hsl2rgb($hsl)); }
    function rgb2hsl(array $rgb): array
    {
        list($r, $g, $b) = $rgb;
        $r /= 255;
        $g /= 255;
        $b /= 255;

        $min = min($r, min($g, $b));
        $max = max($r, max($g, $b));
        $delta = $max - $min;

        $s = 0;
        $l = ($min + $max) / 2;
        if ($l > 0 && $l < 1)
            $s = $delta / ($l < 0.5 ? (2 * $l) : (2 - 2 * $l));

        $h = 0;
        if ($delta > 0) {
            if ($max == $r && $max != $g) $h += ($g - $b) / $delta;
            if ($max == $g && $max != $b) $h += (2 + ($b - $r) / $delta);
            if ($max == $b && $max != $r) $h += (4 + ($r - $g) / $delta);
            $h /= 6;
        }

        return [round($h,5), round($s,5), round($l,5)];
    }

    function hsl2rgb(array $hsl): array
    {
        list($h, $s, $l) = $hsl;
        $m2 = ($l <= 0.5) ? $l * ($s + 1) : $l + $s - $l*$s;
        $m1 = $l * 2 - $m2;
        return [
            0 => intval(round(hue2rgb($m1, $m2, $h + 0.33333) * 255)),
            1 => intval(round(hue2rgb($m1, $m2, $h) * 255)),
            2 => intval(round(hue2rgb($m1, $m2, $h - 0.33333) * 255)),
        ];
    }

    function hue2rgb($m1, $m2, $h)
    {
        $h = ($h < 0) ? $h + 1 : (($h > 1) ? $h - 1 : $h);
        if ($h * 6 < 1) return $m1 + ($m2 - $m1) * $h * 6;
        if ($h * 2 < 1) return $m2;
        if ($h * 3 < 2) return $m1 + ($m2 - $m1) * (0.66666 - $h) * 6;

        return $m1;
    }

    function apply_callback(callable $callback, $value)
    {
        if(is_array($value)) {

            $array = [];
            foreach($value as $v)
                $array[] = $callback($v);

            return $array;
        }

        return $callback($value);
    }

    function is_identity(array $array) 
    {
        foreach($array as $key => $value) {

            if(is_array($value)) {
                
                if($value[$key] ?? $key !== $key) return false;

            } else {
                
                if($key !== $value) return false;
            }
        }

        return true;
    }
}
