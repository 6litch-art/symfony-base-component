<?php

namespace Base\Database\Filter;

use Base\Annotations\AnnotationReader;
use Base\Database\Annotation\Trasheable;
use Base\Traits\BaseTrait;
use Doctrine\ORM\Mapping\ClassMetaData;
use Doctrine\ORM\Query\Filter\SQLFilter;

class TrashFilter extends SQLFilter
{
    public function addFilterConstraint(ClassMetadata $targetEntity, $alias): string
    {
        $trasheableAnnotation = AnnotationReader::getInstance()->getClassAnnotations($targetEntity->getName(), Trasheable::class);
        if(count($trasheableAnnotation) < 1) return "";

        $fieldName = end($trasheableAnnotation)->deletedAt;
        if ($targetEntity->hasField($fieldName)) {

            $date = date("Y-m-d H:i:s");
            return $alias.".".$fieldName." < '".$date."' OR ".$alias.".".$fieldName." IS NULL";
        }

        return "";
    }
}
