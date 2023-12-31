<?php

namespace Base\Annotations;

use App\Entity\User;
use Base\Database\Mapping\ClassMetadataManipulator;
use Base\Database\Entity\EntityHydrator;
use Base\Database\Mapping\ClassMetadataCompletor;
use Base\Service\FlysystemInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepositoryInterface;
use Doctrine\ORM\EntityNotFoundException;
use Doctrine\ORM\Event\PostFlushEventArgs;
use Doctrine\ORM\Event\PreFlushEventArgs;
use Doctrine\Persistence\Event\LifecycleEventArgs as BaseLifecycleEventArgs;

use Doctrine\ORM\Event\OnFlushEventArgs;

use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\UnitOfWork;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Exception;

abstract class AbstractAnnotation implements AnnotationInterface
{
    public static function getAnnotationReader()
    {
        return AnnotationReader::getInstance();
    }
    public static function getEnvironment()
    {
        return AnnotationReader::getInstance()->getEnvironment();
    }
    public static function getService()
    {
        return AnnotationReader::getInstance()->getService();
    }
    public static function getProjectDir()
    {
        return AnnotationReader::getInstance()->getProjectDir();
    }
    public static function getParameterBag()
    {
        return AnnotationReader::getInstance()->getParameterBag();
    }
    public static function getDoctrineReader()
    {
        return AnnotationReader::getInstance()->getDoctrineReader();
    }
    public static function getEntityManager()
    {
        return AnnotationReader::getInstance()->getEntityManager();
    }
    public static function getEntityHydrator()
    {
        return AnnotationReader::getInstance()->getEntityHydrator();
    }
    public static function getTypeOfField($className, string $property)
    {
        return AnnotationReader::getInstance()->getClassMetadataManipulator()->getTypeOfField($className, $property);
    }

    public static function getClassMetadata($objectOrClass): ?ClassMetadata
    {
        return self::getEntityManager()->getClassMetadata(is_object($objectOrClass) ? get_class($objectOrClass) : $objectOrClass);
    }
    public static function getClassMetadataManipulator(): ?ClassMetadataManipulator
    {
        return AnnotationReader::getInstance()->getClassMetadataManipulator();
    }
    public static function getClassMetadataCompletor(mixed $entityOrClassOrMetadata): ?ClassMetadataCompletor
    {
        return AnnotationReader::getInstance()->getClassMetadataManipulator()->getClassMetadataCompletor($entityOrClassOrMetadata);
    }

    public static function getFlysystem(): FlysystemInterface
    {
        return AnnotationReader::getInstance()->getFlysystem();
    }
    public static function getImpersonator(): ?User
    {
        return AnnotationReader::getInstance()->getImpersonator();
    }
    public static function getUser(): ?User
    {
        return AnnotationReader::getInstance()->getUser();
    }
    public static function getRepository($className)
    {
        return AnnotationReader::getInstance()->getRepository($className);
    }
    public static function getAsset($url)
    {
        return AnnotationReader::getInstance()->getAsset($url);
    }

    public static function getAnnotations($entityOrClassNameOrMetadataOrRefl, string $mappingPath, ?string $annotationClass = null): array
    {
        if (!$entityOrClassNameOrMetadataOrRefl) {
            return [];
        }
        if (AnnotationReader::getInstance()->isEntity($entityOrClassNameOrMetadataOrRefl)) {
            $entityOrClassNameOrMetadataOrRefl = is_object($entityOrClassNameOrMetadataOrRefl) ? get_class($entityOrClassNameOrMetadataOrRefl) : $entityOrClassNameOrMetadataOrRefl;
        }

        $mapping = $mappingPath;
        if (($dot = strpos($mapping, ".")) > 0) {
            $fieldPath = trim(substr($mapping, 0, $dot));
            $mapping   = trim(substr($mapping, $dot+1));

            $entityOrClassNameOrMetadataOrRefl = self::getClassMetadataManipulator()->getTargetClass($entityOrClassNameOrMetadataOrRefl, $fieldPath);
            if (!$entityOrClassNameOrMetadataOrRefl) {
                return [];
            }
        }

        $annotations = AnnotationReader::getInstance()->getPropertyAnnotations($entityOrClassNameOrMetadataOrRefl);
        foreach ($annotations as $column => $annotation) {
            if ($annotationClass !== null) {
                $annotations[$column] = array_filter($annotation, fn ($a) => is_instanceof($a, $annotationClass));
            }
        }

        return $annotations[$mapping] ?? [];
    }

    public static function getAnnotation($entityOrClassNameOrMetadataOrRefl, string $mapping, string $annotationClass): mixed
    {
        $annotations = self::getAnnotations($entityOrClassNameOrMetadataOrRefl, $mapping, $annotationClass);
        return !empty($annotations) ? end($annotations) : null;
    }

    public static function hasAnnotation($entityOrClassNameOrMetadataOrRefl, string $mapping, string $annotationClass)
    {
        $annotations = self::getAnnotations($entityOrClassNameOrMetadataOrRefl, $mapping, $annotationClass);
        return !empty($annotations);
    }

    /**
     * Minimize the use unit of work to very specific context.. (doctrine internal use only)
     * Please use getNativeEntity() to get back the
     */
    public static function getUnitOfWork(): UnitOfWork
    {
        return AnnotationReader::getInstance()->getEntityManager()->getUnitOfWork();
    }
    public static function getEntityChangeSet($entity)
    {
        // (NB: /!\ computeChangeSets != recomputeSingleChangeSets)
        self::getUnitOfWork()->recomputeSingleEntityChangeSet(
            self::getClassMetadata($entity),
            $entity
        );

        return self::getUnitOfWork()->getEntityChangeSet($entity);
    }

    protected static $entitySerializer = null;
    public static function getSerializer()
    {
        if (!self::$entitySerializer) {
            self::$entitySerializer = new Serializer([new DateTimeNormalizer(), new ObjectNormalizer()], [new JsonEncoder()]);
        }

        return self::$entitySerializer;
    }

    public static function isSerializable(AbstractAnnotation $annotation)
    {
        try {
            return is_serializable($annotation);
        } catch (Exception $e) {
            return false;
        }
    }

    public static function inDoctrineStack()
    {
        $debug_backtrace = debug_backtrace();
        foreach ($debug_backtrace as $trace) {
            if (str_starts_with($trace["class"], "Doctrine")) {
                return true;
            }
        }

        return false;
    }

    public function getPropertyOwnerRepository($entity, string $property): ServiceEntityRepositoryInterface
    {
        $className = get_class($entity);
        $repository = $this->getEntityManager()->getRepository($className);

        while ($className = get_parent_class($className)) {
            if (property_exists($className, $property)) {
                $repository = $this->getEntityManager()->getRepository($className);
            }
        }

        return $repository;
    }

    public static function getEntityFromData($classname, $data): ?object
    {
        if ($data === null) {
            return null;
        }

        $fieldNames          = self::getClassMetadata($classname)->getFieldNames();
        $fields  = array_intersect_key($data, array_flip($fieldNames));
        $associations = array_diff_key($data, array_flip($fieldNames));

        $entity = AnnotationReader::getInstance()->getEntityHydrator()->hydrate($classname, array_merge($fields, $associations));
        return $entity;
    }

    public static function getOriginalEntity($entity): ?object
    {
        return self::getEntityFromData(get_class($entity), self::getOriginalEntityData($entity));
    }
    public static function getOriginalEntityData($entity): ?array
    {
        $primaryKey = self::getClassMetadataManipulator()->getPrimaryKey($entity); // primaryKey information missing

        try {
            $entityData = self::getUnitOfWork()->getOriginalEntityData($entity);
        } catch (EntityNotFoundException $e) {
            return null;
        }

        $entityData[$primaryKey] = self::getFieldValue($entity, $primaryKey);
        return $entityData;
    }

    public static function getOldEntity($entity): ?object
    {
        return self::getEntityFromData(get_class($entity), self::getOldEntityData($entity), [], EntityHydrator::OBJECT_PROPERTIES);
    }
    public static function getOldEntityData($entity): ?array
    {
        $changeSet  = self::getEntityChangeSet($entity);

        // Replace original entity values by the changeSet
        //   It happens that "original" entity data doesn't mean,
        //   original value before form submission
        $entityData = self::getOriginalEntityData($entity);

        foreach ($entityData as $key => $_) {
            if (array_key_exists($key, $changeSet)) {
                $entityData[$key] = $changeSet[$key][0];
            }
        }

        return $entityData;
    }

    public static function hasField($entity, string $property): bool
    {
        return self::getClassMetadataManipulator()->hasField($entity, $property);
    }
    public static function getFieldValue($entity, string $property)
    {
        return self::getClassMetadataManipulator()->getFieldValue($entity, $property);
    }
    public static function setFieldValue($entity, string $property, $value)
    {
        return self::getClassMetadataManipulator()->setFieldValue($entity, $property, $value);
    }

    public static function hasProperty($entity, string $property)
    {
        return property_exists($entity, $property);
    }
    public static function getPropertyValue($entity, string $property)
    {
        return self::getClassMetadataManipulator()->getPropertyValue($entity, $property);
    }
    public static function setPropertyValue($entity, string $property, $value)
    {
        return self::getClassMetadataManipulator()->setPropertyValue($entity, $property, $value);
    }

    abstract public function supports(string $target, ?string $targetValue = null, mixed $object = null): bool;

    public function loadClassMetadata(ClassMetadata $classMetadata, string $target, ?string $targetValue = null)
    {
    }

    public function preFlush(PreFlushEventArgs $args, ClassMetadata $classMetadata, mixed $entity, ?string $property = null)
    {
    }
    public function onFlush(OnFlushEventArgs $args, ClassMetadata $classMetadata, mixed $entity, ?string $property = null)
    {
    }
    public function postFlush(PostFlushEventArgs $args, ClassMetadata $classMetadata, mixed $entity, ?string $property = null)
    {
    }

    public function prePersist(BaseLifecycleEventArgs $event, ClassMetadata $classMetadata, mixed $entity, ?string $property = null)
    {
    }
    public function preUpdate(BaseLifecycleEventArgs $event, ClassMetadata $classMetadata, mixed $entity, ?string $property = null)
    {
    }
    public function preRemove(BaseLifecycleEventArgs $event, ClassMetadata $classMetadata, mixed $entity, ?string $property = null)
    {
    }

    public function postLoad(BaseLifecycleEventArgs $event, ClassMetadata $classMetadata, mixed $entity, ?string $property = null)
    {
    }
    public function postPersist(BaseLifecycleEventArgs $event, ClassMetadata $classMetadata, mixed $entity, ?string $property = null)
    {
    }
    public function postUpdate(BaseLifecycleEventArgs $event, ClassMetadata $classMetadata, mixed $entity, ?string $property = null)
    {
    }
    public function postRemove(BaseLifecycleEventArgs $event, ClassMetadata $classMetadata, mixed $entity, ?string $property = null)
    {
    }
}
