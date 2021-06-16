<?php

namespace Base\Validator;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\Violation\ConstraintViolationBuilderInterface;

use Symfony\Component\Validator\Exception\ConstraintDefinitionException;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

use Doctrine\Persistence\ManagerRegistry;

/**
 * @Annotation
 */
abstract class ConstraintEntityValidator extends ConstraintValidator
{
    protected $doctrine;
    protected $em;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
        parent::__construct();
    }

    public function getDoctrine()
    {
        return $this->doctrine;
    }

    public function getEntityManager($entityName)
    {
        if (is_object($entityName)) $class = get_class($entityName);
        else $class = $entityName;

        return $this->getDoctrine()->getManagerForClass($class);
    }

    public function getRepository($entityName)
    {
        if (is_object($entityName)) $class = get_class($entityName);
        else $class = $entityName;

        return $this->getEntityManager($class)->getRepository($class);
    }

    public function getOriginalEntity($entity)
    {
        $class = get_class($entity);
        $originalEntity = new $class();

        // Hydrate class
        $attributes = $this->getEntityManager($class)->getUnitOfWork()->getOriginalEntityData($entity);
        foreach ($attributes as $key => $value) {

            // One gets the setter's name matching the attribute.
            $method = 'set' . ucfirst($key);

            // If the matching setter exists
            if (method_exists($originalEntity, $method)) {
                // One calls the setter.
                $originalEntity->$method($value);
            }
        }

        return $originalEntity;
    }

    public function getEntityChangeSet($entity): ?array
    {
        $class = get_class($entity);

        $uow = $this->getEntityManager($class)->getUnitOfWork();
        $uow->computeChangeSets();

        return $uow->getEntityChangeSet($entity);
    }

    public function getClassMetadata($entityName)
    {
        if (is_object($entityName)) $class = get_class($entityName);
        else $class = $entityName;

        return $this->getEntityManager($class)->getClassMetadata($class);
    }

    public function buildViolation($value, Constraint $constraint): ConstraintViolationBuilderInterface
    {
        $buildViolation = $this->context
            ->buildViolation($constraint->message);

        $entity = $constraint->entity;
        if(!$entity) return $buildViolation;

       // $errorPath = (null !== $constraint->errorPath ? $constraint->errorPath : $constraint->fields[0]);

        $entityExploded = explode("\\", \get_class($entity));
        $entityName = strtolower(array_pop($entityExploded));

        if ($constraint->em) {
            $em = $this->getDoctrine()->getManager($constraint->em);

            if (!$em) {
                throw new ConstraintDefinitionException(sprintf('Object manager "%s" does not exist.', $constraint->em));
            }
        } else {
            $em = $this->getDoctrine()->getManagerForClass(\get_class($entity));

            if (!$em) {
                throw new ConstraintDefinitionException(sprintf('Unable to find the object manager associated with an entity of class "%s".', get_debug_type($entity)));
            }
        }

        $class = $em->getClassMetadata(\get_class($entity));
        $buildViolation
//            ->atPath($errorPath)
            ->setParameter('{{ entity }}', $entityName ?? "")
            ->setParameter('{{ value }}', $this->formatWithIdentifiers($em, $class, $value))
            ->setParameter('{{ field }}', $constraint->fields[0] ?? "unknown")
            ->setInvalidValue($value)
            ->setTranslationDomain('validators')
            ->addViolation();

        return $buildViolation;
    }

    public function validate($entity, Constraint $constraint)
    {
        $fields = (array) $constraint->fields;
        if (0 === \count($fields)) {
            throw new ConstraintDefinitionException('At least one field has to be specified.');
        }

        if (null === $entity) {
            return false;
        }

        if (!is_a($constraint, $this->constraintClass))
            throw new UnexpectedTypeException($constraint, $this->constraintClass);

        if (!\is_array($constraint->fields) && !\is_string($constraint->fields))
            throw new UnexpectedTypeException($constraint->fields, 'array');

    //    if (null !== $constraint->errorPath && !\is_string($constraint->errorPath))
      //      throw new UnexpectedTypeException($constraint->errorPath, 'string or null');

        $this->em = $this->getDoctrine()->getManagerForClass(get_class($entity));
    }

    private function formatWithIdentifiers($em, $class, $value)
    {
        if (!\is_object($value) || $value instanceof \DateTimeInterface) {
            return $this->formatValue($value, self::PRETTY_DATE);
        }

        if (method_exists($value, '__toString')) {
            return (string) $value;
        }

        if ($class->getName() !== $idClass = \get_class($value)) {
            // non unique value might be a composite PK that consists of other entity objects
            if ($em->getMetadataFactory()->hasMetadataFor($idClass)) {
                $identifiers = $em->getClassMetadata($idClass)->getIdentifierValues($value);
            } else {
                // this case might happen if the non unique column has a custom doctrine type and its value is an object
                // in which case we cannot get any identifiers for it
                $identifiers = [];
            }
        } else {
            $identifiers = $class->getIdentifierValues($value);
        }

        if (!$identifiers) {
            return sprintf('object("%s")', $idClass);
        }

        array_walk($identifiers, function (&$id, $field) {
            if (!\is_object($id) || $id instanceof \DateTimeInterface) {
                $idAsString = $this->formatValue($id, self::PRETTY_DATE);
            } else {
                $idAsString = sprintf('object("%s")', \get_class($id));
            }

            $id = sprintf('%s => %s', $field, $idAsString);
        });

        return sprintf('object("%s") identified by (%s)', $idClass, implode(', ', $identifiers));
    }
}