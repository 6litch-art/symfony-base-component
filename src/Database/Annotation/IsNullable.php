<?php

namespace Base\Database\Annotation;

use Base\Annotations\AbstractAnnotation;
use Base\Annotations\AnnotationReader;
use Doctrine\ORM\Mapping\ClassMetadata;
use Exception;

/**
 * @Annotation
 * @Target({"CLASS", "PROPERTY"})
 * @Attributes({
 *   @Attribute("column" , type = "string"),
 *   @Attribute("value" , type = "bool")
 * })
 */

class IsNullable extends AbstractAnnotation
{
    /** @Required */
    private string $column;
    private bool $value;

    public function __construct(array $data)
    {
        $this->column = $data["column"]  ?? "";
        $this->value  = $data["value"]  ?? "";
    }

    public function supports(ClassMetadata $classMetadata, string $target, ?string $targetValue = null, $entity = null):bool
    {
        return ($target == AnnotationReader::TARGET_CLASS || $target == AnnotationReader::TARGET_PROPERTY);
    }

    public function loadClassMetadata(ClassMetadata $classMetadata, string $target = null, string $targetValue = null)
    {
        if(!property_exists($classMetadata->getName(), $this->column)) throw new Exception("Invalid column property \"$this->column\" provided in annotation of class ".$classMetadata->getName());
        
        $associationMapping = $classMetadata->getAssociationMapping($this->column);
        $associationMapping["nullable"] = $this->value;

        if(array_key_exists($this->column,  $classMetadata->associationMappings))
            $classMetadata->associationMappings[$this->column] = $associationMapping;
    }
}