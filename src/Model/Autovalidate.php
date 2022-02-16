<?php

namespace Base\Model;

use Base\Service\TranslatorInterface;
use Base\Validator\Constraint;

class Autovalidate
{
    public function __construct(TranslatorInterface $translator = null)
    {   
        $this->translator = $translator;
    }

    public function validate($value, Constraint ...$constraints): bool
    {
        return true;
    }
}