<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Base\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Base\Validator\ConstraintEntityValidator;
use Symfony\Component\Validator\Exception\ConstraintDefinitionException;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class UniqueEntityValidator extends ConstraintEntityValidator
{
    /**
     * @param object $entity
     *
     * @throws UnexpectedTypeException
     * @throws ConstraintDefinitionException
     */
    public function validate($entity, Constraint $constraint)
    {
        parent::validate($entity, $constraint);

        $em = $constraint->em ?? $this->getEntityManager(\get_class($entity));
        if (!$em) {
            throw new ConstraintDefinitionException(sprintf('Unable to find the object manager associated with an entity of class "%s".', get_debug_type($entity)));
        }

        $classMetadata = $this->getClassMetadata($entity);

        $criteria = [];
        $hasNullValue = false;

        $fields = array_map(fn ($f) => $classMetadata->getFieldName($f), $constraint->fields);
        foreach ($fields as $key => $fieldName) {
            //
            // Property path
            $fieldPath = explode(".", $fieldName);
            if (count($fieldPath) > 1) {
                $fieldName = head($fieldPath);
                if (!$classMetadata->hasAssociation($fieldName)) {
                    throw new ConstraintDefinitionException(sprintf('The field "%s" is expected to be an association.', $fieldName));
                }

                foreach ($classMetadata->getFieldValue($entity, $fieldName) as $association) {
                    $constraint->fields[$key] = implode(".", tail($fieldPath));
                    $constraint->message = implode(".", tail($fieldPath));

                    $this->validate($association, $constraint);
                }

                return;
            }

            //
            // Default check
            if (!$classMetadata->hasField($fieldName) && !$classMetadata->hasAssociation($fieldName)) {
                throw new ConstraintDefinitionException(sprintf('The field "%s" in "'.get_class($entity).'" is not mapped by Doctrine, so it cannot be validated for uniqueness.', $fieldName));
            }

            $fieldValue = $classMetadata->reflFields[$fieldName]->getValue($entity);

            if (null === $fieldValue) {
                $hasNullValue = true;
            }

            if ($constraint->ignoreNull && null === $fieldValue) {
                continue;
            }

            $criteria[$fieldName] = $fieldValue;
            if (null !== $criteria[$fieldName] && $classMetadata->hasAssociation($fieldName)) {
                /* Ensure the Proxy is initialized before using reflection to
                 * read its identifiers. This is necessary because the wrapped
                 * getter methods in the Proxy are being bypassed.
                 */
                $em->initializeObject($criteria[$fieldName]);
            }
        }

        // validation doesn't fail if one of the fields is null and if null values should be ignored
        if ($hasNullValue && $constraint->ignoreNull) {
            return;
        }

        // skip validation if there are no criteria (this can happen when the
        // "ignoreNull" option is enabled and fields to be checked are null
        if (empty($criteria)) {
            return;
        }

        if (null !== $constraint->entityClass) {
            /* Retrieve repository from given entity name.
             * We ensure the retrieved repository can handle the entity
             * by checking the entity is the same, or subclass of the supported entity.
             */
            $repository = $em->getRepository($constraint->entityClass);
            $supportedClass = $repository->getClassName();

            if (!$entity instanceof $supportedClass) {
                throw new ConstraintDefinitionException(sprintf('The "%s" entity repository does not support the "%s" entity. The entity should be an instance of or extend "%s".', $constraint->entityClass, $classMetadata->getName(), $supportedClass));
            }
        } else {
            $repository = $em->getRepository(\get_class($entity));
        }

        $result = $repository->{$constraint->repositoryMethod}($criteria);
        if ($result instanceof \IteratorAggregate) {
            $result = $result->getIterator();
        }

        /* If the result is a MongoCursor, it must be advanced to the first
         * element. Rewinding should have no ill effect if $result is another
         * iterator implementation.
         */
        if ($result instanceof \Iterator) {
            $result->rewind();
            if ($result instanceof \Countable && 1 < \count($result)) {
                $result = [$result->current(), $result->current()];
            } else {
                $result = $result->valid() && null !== $result->current() ? [$result->current()] : [];
            }
        } elseif (\is_array($result)) {
            reset($result);
        } else {
            $result = null === $result ? [] : [$result];
        }

        /* If no entity matched the query criteria or a single entity matched,
         * which is the same as the entity being validated, the criteria is
         * unique.
         */
        if (!$result || (1 === \count($result) && current($result) === $entity)) {
            return;
        }

        if ($constraint instanceof \Base\Validator\ConstraintEntity) {
            $constraint->entity  = $entity;
        }

        $errorPath = null !== $constraint->errorPath ? $constraint->errorPath : $fields[0];
        $invalidValue = $criteria[$errorPath] ?? $criteria[$fields[0]];

        $this->buildViolation($constraint, $invalidValue)->addViolation();
    }
}
