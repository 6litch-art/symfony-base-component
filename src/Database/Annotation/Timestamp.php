<?php

namespace Base\Database\Annotation;

use Base\Database\AbstractAnnotation;
use Base\Database\AnnotationReader;
use DateTime;
use Doctrine\ORM\Event\LoadClassMetadataEventArgs;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Mapping\ClassMetadata;

/**
 * Class Timestamp
 * package Base\Database\Annotation\Timestamp
 *
 * @Annotation
 * @Target({"CLASS", "PROPERTY"})
 * @Attributes({
 *   @Attribute("on", type = "array"),
 *   @Attribute("fields", type = "array"),
 *   @Attribute("value", type = "datetime")
 * })
 */
class Timestamp extends AbstractAnnotation
{
    private array $fields;
    private array $context;

    /**
     * @var DateTime
     */
    private $value;

    public function __construct( array $data ) {

        $this->context = array_map("strtolower", $data['on']);
        $this->fields = $data['fields'] ?? [];
        $this->value = $data['value'] ?? "";
    }

    public function getContext(): array {
        return $this->context;
    }

    public function getFields(): array {
        return $this->fields;
    }

    public function getValue(): \DateTime {

        if(!$this->value)
            $this->value = new DateTime("now");

        return $this->value;
    }

    public function supports($classMetadata, string $target, ?string $targetValue = null, $entity = null): bool
    {
        if(!empty($this->fields) && !in_array($targetValue, $this->fields)) return false;

        return in_array("update", $this->context) || in_array("create", $this->context);
    }

    public function prePersist(LifecycleEventArgs $event, $entity, ?string $property = null)
    {
        if(!in_array("create", $this->context)) return;

        $this->setFieldValue($entity, $property, $this->getValue());
    }

    public function preUpdate(LifecycleEventArgs $event, $entity, ?string $property = null)
    {
        if (!in_array("update", $this->context)) return;

        $this->setFieldValue($entity, $property, $this->getValue());
    }
}
