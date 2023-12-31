<?php

namespace Base\Validator\Constraints;

use Base\Validator\ConstraintValidator;
use Symfony\Component\Validator\Constraint;

class HexcodeValidator extends ConstraintValidator
{
    public function validate(mixed $color, Constraint $constraint)
    {
        if (!empty(trim($color)) && 1 !== preg_match("/^#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})$/", $color)) {
            $this->buildViolation($constraint, $color)->addViolation();
        }
    }
}
