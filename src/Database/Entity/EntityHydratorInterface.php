<?php

namespace Base\Database\Entity;

interface EntityHydratorInterface
{
    public function hydrate(mixed $entity, null|array|object $data = [], array $fieldExceptions = [], int $aggregateModel = EntityHydrator::DEFAULT_AGGREGATE, ...$constructArguments): mixed;
    public function dehydrate(mixed $entity, array $fieldExceptions = []): ?array;
}
