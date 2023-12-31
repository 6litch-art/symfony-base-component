<?php

namespace Base\Enum;

use Base\Database\Type\SetType;
use Base\Service\Model\IconizeInterface;

class UploadState extends SetType implements IconizeInterface
{
    public const UPLOAD_ERROR     = "UPLOAD_ERROR";
    public const UPLOAD_FILESIZE  = "UPLOAD_FILESIZE";
    public const UPLOAD_MIMETYPE  = "UPLOAD_MIMETYPE";

    public function __iconize(): ?array
    {
        return null;
    }
    public static function __iconizeStatic(): ?array
    {
        return [
            self::UPLOAD_ERROR => ["fa-solid fa-exclamation-triangle"],

            self::UPLOAD_FILESIZE => ["fa-brands fa-mixer"],
            self::UPLOAD_MIMETYPE => ["fa-solid fa-filter"]
        ];
    }
}
