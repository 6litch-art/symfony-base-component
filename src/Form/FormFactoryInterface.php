<?php

namespace Base\Form;

use Base\Form\Traits\FormGuessInterface;
use Symfony\Component\Form\FormFactoryInterface as SymfonyFormFactoryInterface;
use Symfony\Component\Form\FormInterface;

interface FormFactoryInterface extends  SymfonyFormFactoryInterface,
    FormGuessInterface
{
}
