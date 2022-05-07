<?php

namespace Base\Filter\Advanced\Thumbnail;

use Base\Filter\Advanced\ThumbnailFilter;
use Imagine\Image\ImageInterface;

class UltraHighDefinitionFilter extends ThumbnailFilter
{
    public function getSuffix() { "4k"; }
    public function __construct($mode = ImageInterface::THUMBNAIL_INSET, $filter = ImageInterface::FILTER_UNDEFINED)
    {
        parent::__construct(3840, 2160, $mode, $filter);
    }
}