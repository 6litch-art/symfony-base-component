<?php

namespace Base\Field\Type;

use Base\Form\Common\AbstractType;
use Symfony\Component\Form\ButtonTypeInterface;
use Symfony\Component\Form\Extension\Core\Type\BaseType;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\SubmitButtonTypeInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SubmitType extends AbstractType implements SubmitButtonTypeInterface
{
    public function getBlockPrefix()
    {
        return "submit2";
    }
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefault("type", "submit");
    }

    public function getParent(): ?string
    {
        return ButtonType::class;
    }
}
