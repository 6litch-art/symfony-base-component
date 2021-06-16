<?php

namespace Base\Validator\Constraints;

use Base\Validator\Constraint;

/**
 * @Annotation
 */
class AlphanumericPlus extends Constraint
{
    public $message = 'validators.alphanumeric_plus';
}