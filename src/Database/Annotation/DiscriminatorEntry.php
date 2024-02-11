<?php

namespace Base\Database\Annotation;

use Base\Annotations\AbstractAnnotation;
use Base\Annotations\AnnotationReader;
use Doctrine\Common\Annotations\Annotation;
use Doctrine\Common\Annotations\Annotation\NamedArgumentConstructor;
use Doctrine\Common\Annotations\Annotation\Target;
use Doctrine\ORM\Mapping\ClassMetadata;
use Exception;

/**
 * @Annotation
 * @NamedArgumentConstructor
 * @Target({"CLASS"})
 */

#[\Attribute(\Attribute::TARGET_CLASS)]
class DiscriminatorEntry extends AbstractAnnotation
{
    /** @Required */
    protected ?string $value;

    public function __construct(?string $value = null)
    {
        $this->value = $value ?? null;
    }

    public function getValue(object|string $object_or_class): string
    {
        if ($this->value !== null) {
            return $this->value;
        }

        // Formatting input object
        $className = is_object($object_or_class) ? get_class($object_or_class) : $object_or_class;
        $namespace = explode("\\Entity\\", $className);
        
        $pos = array_search('Entity', $namespace);
        if($pos !== false) unset($namespace[$pos]);

        // Special case for App and Base entities
        $namespaceRoot = array_shift($namespace);
        if(str_starts_with($namespaceRoot, "Base")) {
       
            //NB: Either returning "common" or "abstract" value for root entity
            $namespacePrefix = explode("\\", $namespaceRoot);
            array_shift($namespacePrefix);
            
            $special = $namespaceRoot == "Base" ? (is_abstract($className) ? "abstract" : "common") : null;
            if ($special && !get_parent_class($className)) {
                return $special;
            }

            // Otherwise.. Just put the class basename (as it is expected to be "general" terms.)
            $namespace = array_unique(explode("\\", $namespace[0] ?? ""));

            $namespacePrefix = implode("_", array_map(fn($n) => mb_lcfirst($n), $namespacePrefix));
            $namespacePrefix = $namespacePrefix ? $namespacePrefix."_" : "";
            return $namespacePrefix.mb_lcfirst(end($namespace));
        }
    
        $namespace = $namespace[0] ?? null;
        if ($namespace === null) {
            throw new Exception("Unexpected location for \"$className\"");
        }

        // Looking for custom parent values
        $parentValue = null;
        $parentNamespace = null;
        if ($parentClassName = get_parent_class($className)) {
            $parentNamespace = explodeByArray("\\Entity\\", $parentClassName)[1] ?? null;
            $parentMetadata = $this->getAnnotationReader()->getAnnotations($parentClassName, $this);
            $parentMetadata = $parentMetadata[AnnotationReader::TARGET_CLASS][$parentClassName];
            if (($parentAttribute = $parentMetadata ? end($parentMetadata) : null)) {
                $parentValue = $parentAttribute->getValue($parentClassName);
                $parentValue = in_array($parentValue, ["abstract", "common"]) ? null : $parentValue;
            }
        }

        // Strip parent prefix namespace
        if ($parentNamespace !== null && $parentValue !== null && str_starts_with($namespace, $parentNamespace . "\\")) {
            $namespace = explode("\\", str_lstrip($namespace, $parentNamespace . "\\"));
            array_unshift($namespace, $parentValue);
        } else {
            $namespace = explode("\\", $namespace);
        }

        // Return final entry value
        $namespace = array_unique($namespace);
        $namespace = array_map("mb_lcfirst", $namespace);

        return implode("_", $namespace);
    }

    /**
     * @param string $target
     * @param string|null $targetValue
     * @param $object
     * @return bool
     * @throws Exception
     */
    public function supports(string $target, ?string $targetValue = null, $object = null): bool
    {
        if ($object === null) {
            return false;
        }

        $classMetadata = null;
        if ($object instanceof ClassMetadata) {
            $classMetadata = $object;
        }

        if ($classMetadata === null) {
            return false;
        }
        if (empty($classMetadata->discriminatorMap) || empty($classMetadata->discriminatorColumn)) {
            throw new Exception("@DiscriminatorEntry \"" . $this->getValue($classMetadata->getName()) . "\" found for \"" . $classMetadata->getName() . "\", but missing discriminator mapping");
        }

        // Only act on the top parent class when discriminatorMap found
        return empty($classMetadata->parentClasses) && count($classMetadata->discriminatorMap) > 0;
    }

    public function loadClassMetadata(ClassMetadata $classMetadata, string $target = null, ?string $targetValue = null)
    {
        // Recompute the map discriminator
        $discriminatorValues = [];
        foreach ($classMetadata->discriminatorMap as $className) {
            $metadata = $this->getAnnotationReader()->getAnnotations($className, $this);
            $metadata = $metadata[AnnotationReader::TARGET_CLASS][$className];
            $metadata = $metadata ? end($metadata) : null;
            if ($metadata === null) {
                throw new Exception("@DiscriminatorEntry metadata not found for \"" . $className . "\". Have you doom the cache ?");
            }

            $discriminatorValues[$className] = $metadata->getValue($className);
        }

        $classMetadata->discriminatorMap = array_flip($discriminatorValues);
        $classMetadata->discriminatorValue = $discriminatorValues[$classMetadata->getName()] ?? null;
        if ($classMetadata->discriminatorValue === null) {
            throw new Exception("Missing discriminator entry in " . $classMetadata->getName());
        }
    }
}
