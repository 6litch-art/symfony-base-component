<?php


namespace Base\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class NotBlankValidator extends ConstraintValidator
{
    /**
     * {@inheritdoc}
     */
    public function validate($value, Constraint $constraint)
    {
        if (!$constraint instanceof NotBlank) {
            throw new UnexpectedTypeException($constraint, NotBlank::class);
        }

        if ($constraint->allowNull && null === $value) {
            return;
        }

        if (\is_string($value) && null !== $constraint->normalizer) {
            $value = ($constraint->normalizer)($value);
        }

        if (false === $value || (empty($value) && '0' != $value) || ($value instanceof \Doctrine\ORM\PersistentCollection && empty($value->toArray()))) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ value }}', $this->formatValue($value))
                ->setCode(NotBlank::IS_BLANK_ERROR)
                ->addViolation();
        }
    }
}
