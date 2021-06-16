<?php

namespace Base\Field\Traits;

trait SelectTypeTrait
{
    public static function array_flatten($array = null)
    {
        $result = array();

        if (!\is_array($array)) {
            $array = func_get_args();
        }

        foreach ($array as $key => $value) {

            if (\is_array($value)) {
                $result = array_merge($result, self::array_flatten($value));
            } else {
                $result = array_merge($result, array($key => $value));
            }
        }

        return $result;
    }

    public static function array_convert($array, $newArray = [])
    {
        if (empty($array)) return $newArray;
        $pop = array_pop($array);

        if (!empty($newArray)) $newArray = [$pop => $newArray];
        else $newArray[array_pop($array)] = $pop;

        return self::array_convert($array, $newArray);
    }

    public static function array_associative_keys($arr)
    {
        return is_array($arr) && array_keys($arr) !== range(0, count($arr) - 1);
    }
}