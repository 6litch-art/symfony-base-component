<?php

namespace Base\DatabaseSubscriber;

use Base\Annotations\AbstractAnnotation;
use Base\Annotations\AnnotationReader;
use Base\BaseBundle;
use Base\Database\Mapping\ClassMetadataManipulator;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Event\PostFlushEventArgs;
use Doctrine\ORM\Event\PreFlushEventArgs;
use Doctrine\ORM\Events;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Event\LoadClassMetadataEventArgs;
use Doctrine\ORM\Event\OnFlushEventArgs;

class AnnotationSubscriber implements EventSubscriberInterface
{
    /**
     * @var AnnotationReader
     */
    protected $annotationReader;

    /**
     * @var EntityManagerInterface
     */
    protected $entityManager;

    /**
     * @var ClassMetadataManipulator
     */
    protected $classMetadataManipulator;

    public function __construct(EntityManagerInterface $entityManager, ClassMetadataManipulator $classMetadataManipulator, AnnotationReader $annotationReader)
    {
        $this->entityManager    = $entityManager;
        $this->classMetadataManipulator = $classMetadataManipulator;
        $this->annotationReader = $annotationReader;
    }

    public function getSubscribedEvents(): array
    {
        return [

            Events::loadClassMetadata,
            Events::postLoad,

            Events::preFlush, Events::onFlush, Events::postFlush,
            Events::prePersist,  Events::preUpdate,  Events::preRemove,
            Events::postPersist, Events::postUpdate, Events::postRemove,
        ];
    }

    protected array $subscriberHistory = [];
    public function loadClassMetadata(LoadClassMetadataEventArgs $event)
    {
        // needs to be booted to be aware of custom doctrine types.
        if (!BaseBundle::getInstance()->hasBooted()) {
            return;
        }

        $className     = $event->getClassMetadata()->name;
        $classMetadata = $event->getClassMetadata();

        if (in_array($className, $this->subscriberHistory)) {
            return;
        }
        $this->subscriberHistory[] =  $className."::".__FUNCTION__;

        $annotations = $this->annotationReader->getAnnotations($className);

        $classAnnotations = $annotations[AnnotationReader::TARGET_CLASS][$className] ?? [];
        foreach ($classAnnotations as $annotation) {
            if (!is_subclass_of($annotation, AbstractAnnotation::class)) {
                continue;
            }

            if (!in_array(AnnotationReader::TARGET_CLASS, $this->annotationReader->getAnnotationTargets($annotation))) {
                continue;
            }

            if (!$annotation->supports(AnnotationReader::TARGET_CLASS, $className, $classMetadata)) {
                continue;
            }

            $annotation->loadClassMetadata($classMetadata, AnnotationReader::TARGET_CLASS, $className);
        }

        $methodAnnotations = $annotations[AnnotationReader::TARGET_METHOD][$className] ?? [];
        foreach ($methodAnnotations as $method => $_) {
            foreach ($_ as $annotation) {
                if (!is_subclass_of($annotation, AbstractAnnotation::class)) {
                    continue;
                }

                if (!in_array(AnnotationReader::TARGET_METHOD, $this->annotationReader->getAnnotationTargets($annotation))) {
                    continue;
                }

                if (!$annotation->supports(AnnotationReader::TARGET_METHOD, $method, $classMetadata)) {
                    continue;
                }

                $annotation->loadClassMetadata($classMetadata, AnnotationReader::TARGET_METHOD, $method);
            }
        }

        $propertyAnnotations = $annotations[AnnotationReader::TARGET_PROPERTY][$className] ?? [];
        foreach ($propertyAnnotations as $property => $_) {
            foreach ($_ as $annotation) {
                if (!is_subclass_of($annotation, AbstractAnnotation::class)) {
                    continue;
                }

                if (!in_array(AnnotationReader::TARGET_PROPERTY, $this->annotationReader->getAnnotationTargets($annotation))) {
                    continue;
                }

                if (!$annotation->supports(AnnotationReader::TARGET_PROPERTY, $property, $classMetadata)) {
                    continue;
                }

                $annotation->loadClassMetadata($classMetadata, AnnotationReader::TARGET_PROPERTY, $property);
            }
        }
    }

    public function preFlush(PreFlushEventArgs $event)
    {
        $uow = $event->getEntityManager()->getUnitOfWork();

        foreach ($uow->getIdentityMap() as $class => $entities) {

            foreach ($entities as $entity) {
                $className = get_class($entity);
                $classMetadata = $this->entityManager->getClassMetadata($className);

                if (in_array($className, $this->subscriberHistory)) {
                    return;
                }
                $this->subscriberHistory[] = $className . "::" . __FUNCTION__;

                $annotations = $this->annotationReader->getAnnotations($className);

                $changeSet = $uow->getEntityChangeSet($entity);
                $propertyAnnotations = $annotations[AnnotationReader::TARGET_PROPERTY][$className] ?? [];
                foreach ($propertyAnnotations as $property => $_) {
                    if (!array_key_exists($property, $changeSet)) {
                        continue;
                    }

                    foreach ($_ as $annotation) {
                        if (!is_subclass_of($annotation, AbstractAnnotation::class)) {
                            continue;
                        }

                        if (!in_array(AnnotationReader::TARGET_PROPERTY, $this->annotationReader->getAnnotationTargets($annotation))) {
                            continue;
                        }

                        if (!$annotation->supports(AnnotationReader::TARGET_PROPERTY, $property, $entity)) {
                            continue;
                        }

                        $annotation->preFlush($event, $classMetadata, $entity, $property);
                    }
                }

                $classAnnotations = $annotations[AnnotationReader::TARGET_CLASS][$className] ?? [];
                foreach ($classAnnotations as $annotation) {
                    if (!is_subclass_of($annotation, AbstractAnnotation::class)) {
                        continue;
                    }

                    if (!in_array(AnnotationReader::TARGET_CLASS, $this->annotationReader->getAnnotationTargets($annotation))) {
                        continue;
                    }

                    if (!$annotation->supports(AnnotationReader::TARGET_CLASS, $className, $entity)) {
                        continue;
                    }

                    $annotation->preFlush($event, $classMetadata, $entity);
                }
            }
        }
    }

    public function onFlush(OnFlushEventArgs $event)
    {
        $uow = $event->getEntityManager()->getUnitOfWork();

        $entities = [];
        foreach ($uow->getScheduledEntityInsertions() as $entity) {
            $entities[] = $entity;
        }
        foreach ($uow->getScheduledEntityUpdates() as $entity) {
            $entities[] = $entity;
        }
        foreach ($uow->getScheduledEntityDeletions() as $entity) {
            $entities[] = $entity;
        }

        foreach ($entities as $entity) {

            $className = get_class($entity);
            $classMetadata  = $this->entityManager->getClassMetadata($className);

            if (in_array($className, $this->subscriberHistory)) {
                return;
            }
            $this->subscriberHistory[] = $className . "::" . __FUNCTION__;

            $annotations = $this->annotationReader->getAnnotations($className);

            $changeSet = $uow->getEntityChangeSet($entity);
            $propertyAnnotations = $annotations[AnnotationReader::TARGET_PROPERTY][$className] ?? [];
            foreach ($propertyAnnotations as $property => $_) {
                if (!array_key_exists($property, $changeSet)) {
                    continue;
                }

                foreach ($_ as $annotation) {
                    if (!is_subclass_of($annotation, AbstractAnnotation::class)) {
                        continue;
                    }

                    if (!in_array(AnnotationReader::TARGET_PROPERTY, $this->annotationReader->getAnnotationTargets($annotation))) {
                        continue;
                    }

                    if (!$annotation->supports(AnnotationReader::TARGET_PROPERTY, $property, $entity)) {
                        continue;
                    }

                    $annotation->onFlush($event, $classMetadata, $entity, $property);
                }
            }

            $classAnnotations = $annotations[AnnotationReader::TARGET_CLASS][$className] ?? [];
            foreach ($classAnnotations as $annotation) {
                if (!is_subclass_of($annotation, AbstractAnnotation::class)) {
                    continue;
                }

                if (!in_array(AnnotationReader::TARGET_CLASS, $this->annotationReader->getAnnotationTargets($annotation))) {
                    continue;
                }

                if (!$annotation->supports(AnnotationReader::TARGET_CLASS, $className, $entity)) {
                    continue;
                }

                $annotation->onFlush($event, $classMetadata, $entity);
            }
        }
    }

    public function postFlush(PostFlushEventArgs $event)
    {
        $uow = $event->getEntityManager()->getUnitOfWork();

        $entities = [];
        foreach ($uow->getScheduledEntityInsertions() as $entity) {
            $entities[] = $entity;
        }
        foreach ($uow->getScheduledEntityUpdates() as $entity) {
            $entities[] = $entity;
        }
        foreach ($uow->getScheduledEntityDeletions() as $entity) {
            $entities[] = $entity;
        }

        foreach ($entities as $entity) {
            $className = get_class($entity);
            $classMetadata  = $this->entityManager->getClassMetadata($className);

            if (in_array($className, $this->subscriberHistory)) {
                return;
            }
            $this->subscriberHistory[] = $className . "::" . __FUNCTION__;

            $annotations = $this->annotationReader->getAnnotations($className);

            $changeSet = $uow->getEntityChangeSet($entity);
            $propertyAnnotations = $annotations[AnnotationReader::TARGET_PROPERTY][$className] ?? [];
            foreach ($propertyAnnotations as $property => $_) {
                if (!array_key_exists($property, $changeSet)) {
                    continue;
                }

                foreach ($_ as $annotation) {
                    if (!is_subclass_of($annotation, AbstractAnnotation::class)) {
                        continue;
                    }

                    if (!in_array(AnnotationReader::TARGET_PROPERTY, $this->annotationReader->getAnnotationTargets($annotation))) {
                        continue;
                    }

                    if (!$annotation->supports(AnnotationReader::TARGET_PROPERTY, $property, $entity)) {
                        continue;
                    }

                    $annotation->postFlush($event, $classMetadata, $entity, $property);
                }
            }

            $classAnnotations = $annotations[AnnotationReader::TARGET_CLASS][$className] ?? [];
            foreach ($classAnnotations as $annotation) {
                if (!is_subclass_of($annotation, AbstractAnnotation::class)) {
                    continue;
                }

                if (!in_array(AnnotationReader::TARGET_CLASS, $this->annotationReader->getAnnotationTargets($annotation))) {
                    continue;
                }

                if (!$annotation->supports(AnnotationReader::TARGET_CLASS, $className, $entity)) {
                    continue;
                }

                $annotation->postFlush($event, $classMetadata, $entity);
            }
        }
    }

    protected function onLifecycle(LifecycleEventArgs $event, $eventName)
    {
        $entity         = $event->getObject();

        $className      = get_class($entity);
        $classMetadata  = $this->entityManager->getClassMetadata($className);

        if (in_array($className, $this->subscriberHistory)) {
            return;
        }
        $this->subscriberHistory[] = $className . "::" . __FUNCTION__;

        $annotations    = $this->annotationReader->getAnnotations($className);

        $propertyAnnotations = $annotations[AnnotationReader::TARGET_PROPERTY][$className] ?? [];
        foreach ($propertyAnnotations as $property => $_) {
            foreach ($_ as $annotation) {
                if (!is_subclass_of($annotation, AbstractAnnotation::class)) {
                    continue;
                }

                if (!in_array(AnnotationReader::TARGET_PROPERTY, $this->annotationReader->getAnnotationTargets($annotation))) {
                    continue;
                }

                if (!$annotation->supports(AnnotationReader::TARGET_PROPERTY, $property, $entity)) {
                    continue;
                }

                $annotation->{$eventName}($event, $classMetadata, $entity, $property);
            }
        }

        $classAnnotations = $annotations[AnnotationReader::TARGET_CLASS][$className] ?? [];
        foreach ($classAnnotations as $annotation) {
            if (!is_subclass_of($annotation, AbstractAnnotation::class)) {
                continue;
            }

            if (!in_array(AnnotationReader::TARGET_CLASS, $this->annotationReader->getAnnotationTargets($annotation))) {
                continue;
            }

            if (!$annotation->supports(AnnotationReader::TARGET_CLASS, $className, $entity)) {
                continue;
            }

            $annotation->{$eventName}($event, $classMetadata, $entity);
        }
    }

    public function prePersist(LifecycleEventArgs $event)
    {
        $this->onLifecycle($event, __FUNCTION__);
    }
    public function preUpdate(LifecycleEventArgs $event)
    {
        $this->onLifecycle($event, __FUNCTION__);
    }
    public function preRemove(LifecycleEventArgs $event)
    {
        $this->onLifecycle($event, __FUNCTION__);
    }

    public function postLoad(LifecycleEventArgs $event)
    {
        $this->onLifecycle($event, __FUNCTION__);
    }
    public function postPersist(LifecycleEventArgs $event)
    {
        $this->onLifecycle($event, __FUNCTION__);
    }
    public function postUpdate(LifecycleEventArgs $event)
    {
        $this->onLifecycle($event, __FUNCTION__);
    }
    public function postRemove(LifecycleEventArgs $event)
    {
        $this->onLifecycle($event, __FUNCTION__);
    }
}
