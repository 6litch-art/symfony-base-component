<?php

namespace Base\Imagine\Svg;

use DOMDocument;
use Imagine\Exception\InvalidArgumentException;
use Imagine\Exception\NotSupportedException;
use Imagine\Exception\RuntimeException;
use Imagine\Image\AbstractImagine;
use Imagine\Image\BoxInterface as ImageBoxInterface;
use Imagine\Image\FontInterface;
use Imagine\Image\Metadata\MetadataBag;
use Imagine\Image\Palette\Color\ColorInterface;
use function in_array;
use function is_resource;

class Imagine extends AbstractImagine
{
    public function create(ImageBoxInterface $size, ColorInterface $color = null): Image
    {
        if (null !== $color) {
            throw new InvalidArgumentException('Imagine SVG does not support colors');
        }

        $document = new DOMDocument();
        $svg = $document->createElementNS('http://www.w3.org/2000/svg', 'svg');
        $svg->setAttribute('version', '1.1');

        if (!$size instanceof Box || Box::TYPE_ABSOLUTE === $size->getType()) {
            $svg->setAttribute('width', (string) $size->getWidth());
            $svg->setAttribute('height', (string) $size->getHeight());
        }

        if (!$size instanceof Box || Box::TYPE_NONE !== $size->getType()) {
            $svg->setAttribute('viewBox', '0 0 '.$size->getWidth().' '.$size->getHeight());
        }

        $document->appendChild($svg);

        return new Image($document, new MetadataBag());
    }

    public function open($path): Image
    {
        $path = $this->checkPath($path);
        $data = @file_get_contents($path);

        if (false === $data) {
            throw new RuntimeException(sprintf('Failed to open file "%s"', $path));
        }

        return $this->doLoad($data, new MetadataBag(['filepath' => $path]));
    }

    public function load($string): Image
    {
        return $this->doLoad($string, new MetadataBag());
    }

    public function read($resource): Image
    {
        if (!is_resource($resource)) {
            throw new InvalidArgumentException('Variable does not contain a stream resource');
        }

        $content = stream_get_contents($resource);

        if (false === $content) {
            throw new InvalidArgumentException('Cannot read resource content');
        }

        return $this->load($content);
    }

    public function font($file, $size, ColorInterface $color): FontInterface
    {
        throw new NotSupportedException('This method is not implemented');
    }

    /**
     * Returns an Image instance from an SVG string.
     *
     * @phpstan-param MetadataBag<mixed> $metadata
     * @psalm-param MetadataBag $metadata
     */
    private function doLoad(string $data, MetadataBag $metadata): Image
    {
        if (0 === strncmp($data, hex2bin('1F8B'), 2)) {
            $data = gzdecode($data);
        }

        if ('' === $data) {
            throw new RuntimeException('An image cannot be created from an empty string');
        }

        $internalErrors = libxml_use_internal_errors(true);
        libxml_clear_errors();
        $disableEntities = null;

        if (LIBXML_VERSION < 20900) {
            $disableEntities = libxml_disable_entity_loader();
        }

        $document = new DOMDocument();
        $document->loadXML($data, LIBXML_NONET);

        libxml_use_internal_errors($internalErrors);

        if (LIBXML_VERSION < 20900) {
            libxml_disable_entity_loader($disableEntities);
        }

        if ($error = libxml_get_last_error()) {
            libxml_clear_errors();

            if (in_array($error->level, [LIBXML_ERR_ERROR, LIBXML_ERR_FATAL], true)) {
                throw new RuntimeException($error->message);
            }
        }

        if ('svg' !== strtolower($document->documentElement->tagName)) {
            throw new RuntimeException('An image could not be created from the given input');
        }

        return new Image($document, $metadata);
    }
}
