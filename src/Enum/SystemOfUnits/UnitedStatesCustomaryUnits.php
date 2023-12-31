<?php

namespace Base\Enum\SystemOfUnits;

use Base\Database\Type\EnumType;
use Base\Service\Model\IconizeInterface;

class UnitedStatesCustomaryUnits extends EnumType implements IconizeInterface
{
    // const ...   = "";

    public function __iconize(): ?array
    {
        return null;
    }
    public static function __iconizeStatic(): ?array
    {
        return [];
    }
}
