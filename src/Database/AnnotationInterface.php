<?php

namespace Base\Database;

use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Event\LoadClassMetadataEventArgs;
use Doctrine\ORM\Event\OnFlushEventArgs;
use Doctrine\ORM\Mapping\ClassMetadata;

interface AnnotationInterface
{
             public function supports(ClassMetadata $classMetadata, string $target, ?string $targetValue = null, $entity = null): bool;
    public function loadClassMetadata(ClassMetadata $classMetadata, string $target, ?string $targetValue = null);

    public function onFlush(OnFlushEventArgs $event, $entity, ?string $property = null);

    public function prePersist(LifecycleEventArgs $event, $entity, ?string $property = null);
    public function preUpdate (LifecycleEventArgs $event, $entity, ?string $property = null);
    public function preRemove (LifecycleEventArgs $event, $entity, ?string $property = null);

    public function postPersist(LifecycleEventArgs $event, $entity, ?string $property = null);
    public function postUpdate (LifecycleEventArgs $event, $entity, ?string $property = null);
    public function postRemove (LifecycleEventArgs $event, $entity, ?string $property = null);

}