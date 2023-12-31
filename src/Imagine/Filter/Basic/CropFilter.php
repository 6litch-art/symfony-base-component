<?php

namespace Base\Imagine\Filter\Basic;

use Base\Imagine\FilterInterface;
use Exception;
use Imagine\Filter\Basic\Crop;
use Imagine\Image\Box;
use Imagine\Image\ImageInterface;
use Imagine\Image\Point;

class CropFilter implements FilterInterface
{
    /** @var string */
    protected string $position;
    /** @var float */
    protected float $x;
    /** @var float */
    protected float $y;
    /** @var float */
    protected float $width;
    /** @var float */
    protected float $height;

    public function __toString()
    {
        return "crop:".$this->getPosition().":".implode("x", $this->getXY()).":".implode("x", $this->getSize());
    }

    public function __construct(float $x = 0, float $y = 0, ?float $width = null, ?float $height = null, string $position = "lefttop")
    {
        $this->x = $x ?? 0;
        $this->y = $y ?? 0;

        $this->width  = $width  ?? 0;
        $this->height = $height ?? 0;
    }

    public function isNormalized(): bool
    {
        if ($this->x      > 1) {
            return false;
        }
        if ($this->y      > 1) {
            return false;
        }
        if ($this->width  > 1) {
            return false;
        }
        if ($this->height > 1) {
            return false;
        }

        return true;
    }

    public function getPosition(): string
    {
        return $this->position ?? "topleft";
    }
    public function getSize(?ImageInterface $image = null): array
    {
        if ($this->isNormalized() && $image !== null) {
            return [$image->getSize()->getWidth()*$this->width, $image->getSize()->getHeight()*$this->height];
        }

        return [$this->width, $this->height];
    }

    public function getXY(?ImageInterface $image = null): array
    {
        list($width, $height) = $this->getSize($image);

        $position = $this->getPosition();
        switch ($position) {
            case 'topleft':
                $x0 = 0;
                $y0 = 0;
                break;
            case 'top':
                $x0 = ($width - $image->getSize()->getWidth()) / 2;
                $y0 = 0;
                break;
            case 'topright':
                $x0 = $width - $image->getSize()->getWidth();
                $y0 = 0;
                break;
            case 'left':
                $x0 = 0;
                $y0 = ($height - $image->getSize()->getHeight()) / 2;
                break;
            case 'centerright':
                $x0 = $width - $image->getSize()->getWidth();
                $y0 = ($height - $image->getSize()->getHeight()) / 2;
                break;
            case 'center':
                $x0 = ($width - $image->getSize()->getWidth()) / 2;
                $y0 = ($height - $image->getSize()->getHeight()) / 2;
                break;
            case 'centerleft':
                $x0 = 0;
                $y0 = ($height - $image->getSize()->getHeight()) / 2;
                break;
            case 'right':
                $x0 = $width - $image->getSize()->getWidth();
                $y0 = ($height - $image->getSize()->getHeight()) / 2;
                break;
            case 'bottomleft':
                $x0 = 0;
                $y0 = $height - $image->getSize()->getHeight();
                break;
            case 'bottom':
                $x0 = ($width - $image->getSize()->getWidth()) / 2;
                $y0 = $height - $image->getSize()->getHeight();
                break;
            case 'bottomright':
                $x0 = $width - $image->getSize()->getWidth();
                $y0 = $height - $image->getSize()->getHeight();
                break;
            default:
                throw new \InvalidArgumentException("Unexpected position '{$position}'");
                break;
        }

        if ($this->isNormalized() && $image !== null) {
            return [$image->getSize()->getWidth()*$this->x, $x0, $image->getSize()->getHeight()*$this->y, $y0];
        }

        return [$this->x, $x0, $this->y, $y0];
    }

    public function apply(ImageInterface $image): ImageInterface
    {
        list($x, $x0, $y, $y0) = $this->getXY($image);
        list($w, $h)          = $this->getSize($image);

        $filter = new Crop(
            new Point((int) $x - $x0, (int) $y - $y0),
            new Box((int) $w - $x0, (int) $h - $y0)
        );

        try {
            return $filter->apply($image);
        } catch (Exception $e) {
            return $image;
        }
    }
}
