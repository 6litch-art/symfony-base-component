<?php

namespace Base\Imagine\Filter\Basic\Definition;

use Base\Imagine\Filter\Basic\ThumbnailFilter;
use Imagine\Image\ImageInterface;

class HighDefinitionFilter extends ThumbnailFilter
{
    public function __toString()
    {
        return "hd";
    }
    public function __construct($mode = ImageInterface::THUMBNAIL_INSET, $filter = ImageInterface::FILTER_UNDEFINED)
    {
        parent::__construct(1280, 720, $mode, $filter);
    }
}
