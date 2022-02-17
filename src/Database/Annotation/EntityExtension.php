<?php

namespace Base\Database\Annotation;

use Base\Annotations\AbstractAnnotation;
use Base\Annotations\AnnotationReader;
use Base\Database\Annotation\EntityExtensionInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Mapping\ClassMetadata;

/**
 * @Annotation
 * @Target({"CLASS"})
 * @Attributes({
 *   @Attribute("reference", type = "string"),
 *   @Attribute("disable",   type = "boolean"),
 * })
 */
class EntityExtension extends AbstractAnnotation
{
    protected ?string $referenceColumn;

    public function __construct( array $data )
    {
        $this->referenceColumn = $data['reference'] ?? null;
        $this->disable = $data['disable'] ?? null;
    }

    public function getReferenceColumn()
    {
        return $this->referenceColumn;
    }

    public function supports(string $target, ?string $targetValue = null, $entity = null): bool
    {
        return ($target == AnnotationReader::TARGET_CLASS);
    }

    protected $extensions = [];
    public function addExtension(EntityExtensionInterface $extension): self
    {
        dump($extension);
        dump(self::$extendedEntities);

        $this->extensions[get_class($extension)] = $extension;
        return $this;
    }

    /**
     * Adds mapping to the translatable and translations.
     */
    public static $extendedEntities   = [];
    public static function get() { return self::$extendedEntities; }
    public static function has($entity):bool 
    {
        $className = is_object($entity) ? get_class($entity) : $entity;
        return in_array($className, self::$extendedEntities); 
    } 
    
    public function loadClassMetadata(ClassMetadata $classMetadata, string $target, ?string $targetValue = null)
    {
        if(!in_array($classMetadata->getName(), self::$extendedEntities))
            self::$extendedEntities[] = $classMetadata->getName();
    }

    public function postPersist(LifecycleEventArgs $event, ClassMetadata $classMetadata, $entity, ?string $property = null)
    {
    }

    public function postUpdate(LifecycleEventArgs $event, ClassMetadata $classMetadata, $entity, ?string $property = null)
    {
    }
}
