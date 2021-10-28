<?php

namespace Base\Validator\Constraints;

use Base\Validator\Constraints\FileSize;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class FileSizeValidator extends ConstraintValidator
{
    public function validate($entry, Constraint $constraint)
    {
        if (!$constraint instanceof FileSize)
            throw new UnexpectedTypeException($constraint, FileSize::class);

        if (null === $entry || '' === $entry)
            return;

        if (!$entry instanceof UploadedFile)
            return;

        dump($entry->getSize(), $constraint->getMaxSize());
        if ($entry->getSize() > $constraint->getMaxSize()) {

            // the argument must be a string or an object implementing __toString()
            $this->context->buildViolation($constraint->message)
            ->setParameter('{0}', $constraint->int2size($constraint->getMaxSize()))
            ->setParameter('{1}', $constraint->int2size($entry->getSize()))
            ->setTranslationDomain('validators')
            ->addViolation();
        }
    }
}
