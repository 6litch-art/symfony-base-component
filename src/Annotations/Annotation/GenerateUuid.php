<?php

namespace Base\Annotations\Annotation;

use Base\Annotations\AbstractAnnotation;
use Base\Annotations\AnnotationReader;

use Doctrine\ORM\Event\OnFlushEventArgs;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\Common\Annotations\Annotation;
use Doctrine\Common\Annotations\Annotation\Target;
use Exception;

use Symfony\Component\Uid\Uuid;
use Doctrine\Common\Annotations\Annotation\NamedArgumentConstructor;

/**
 * Class GenerateUuid
 * package Base\Metadata\Extension\GenerateUuid
 *
 * @Annotation
 * @NamedArgumentConstructor
 * @Target({"PROPERTY"})
 */

 #[\Attribute(\Attribute::TARGET_PROPERTY)]
class GenerateUuid extends AbstractAnnotation
{
    private mixed $version;
    public const V1_MAC = 1;
    public const V2_DCE = 2;
    public const V3_MD5 = 3;
    public const V4_RANDOM = 4;
    public const V5_SHA1 = 5;
    public const V6_SORTABLE = 6;

    public const UUID_NS_DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    public const UUID_NS_URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
    public const UUID_NS_OID = "6ba7b812-9dad-11d1-80b4-00c04fd430c8";
    public const UUID_NS_X500 = "6ba7b814-9dad-11d1-80b4-00c04fd430c8";

    protected mixed $namespace;

    public function __construct(int $version = self::V4_RANDOM, ?string $namespace = null)
    {
        // Determine version
        $versionValid = ($version >= self::V1_MAC && $version <= self::V6_SORTABLE);
        $this->version = ($versionValid) ? $version : self::V4_RANDOM;

        // Determine namespace
        $this->namespace = $namespace;
        if ($this->version == self::V3_MD5 || $this->version == self::V5_SHA1) {
            if (!$this->namespace) {
                throw new Exception("Namespace required for UUID v" . $this->version);
            }
        }
    }

    /**
     * @return int|mixed
     */
    public function getVersion()
    {
        return $this->version;
    }

    /**
     * @param $entity
     * @return string
     */
    public function getUuid($entity): string
    {
        return match ($this->version) {
            self::V1_MAC => Uuid::v1(),
            self::V2_DCE => new Exception("UUID v2 is not implemented.. sorry"),
            //return Uuid::v2();
            self::V3_MD5 => Uuid::v3(new Uuid($this->namespace), get_class($entity)),
            self::V4_RANDOM => Uuid::v4(),
            self::V5_SHA1 => Uuid::v5(new Uuid($this->namespace), get_class($entity)),
            self::V6_SORTABLE => Uuid::v6()
        };
    }

    /**
     * @param string $target
     * @param string|null $targetValue
     * @param $object
     * @return bool
     */
    public function supports(string $target, ?string $targetValue = null, $object = null): bool
    {
        return ($target == AnnotationReader::TARGET_PROPERTY);
    }

    /**
     * @param OnFlushEventArgs $event
     * @param ClassMetadata $classMetadata
     * @param $entity
     * @param string|null $property
     * @return void
     * @throws Exception
     */
    public function onFlush(OnFlushEventArgs $event, ClassMetadata $classMetadata, $entity, ?string $property = null)
    {
        if ($this->getFieldValue($entity, $property) === null) {
            $this->setFieldValue($entity, $property, $this->getUuid($entity));
            if ($this->getUnitOfWork()->getEntityChangeSet($entity)) {
                $this->getUnitOfWork()->recomputeSingleEntityChangeSet($classMetadata, $entity);
            }
        }
    }
}
