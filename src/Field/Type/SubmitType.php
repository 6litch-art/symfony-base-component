<?php

namespace Base\Field\Type;

use Base\Form\Common\AbstractType;
use Symfony\Component\Form\SubmitButtonTypeInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

/**
 *
 */
class SubmitType extends AbstractType implements SubmitButtonTypeInterface
{
    /**
     * @return string
     */
    public function getBlockPrefix()
    {
        return "submit2";
    }

    public function getParent(): ?string
    {
        return ButtonType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefault("type", "submit");
    }
}