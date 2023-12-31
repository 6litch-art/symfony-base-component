<?php

namespace Base\Imagine\Filter\Basic\Definition;

use Base\Imagine\Filter\Basic\ThumbnailFilter;
use Imagine\Image\ImageInterface;

class StandardDefinitionFilter extends ThumbnailFilter
{
    public function __toString()
    {
        return "sd";
    }
    public function __construct($mode = ImageInterface::THUMBNAIL_INSET, $filter = ImageInterface::FILTER_UNDEFINED)
    {
        parent::__construct(720, 480, $mode, $filter);
    }
}
