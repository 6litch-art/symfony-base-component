<?php

namespace Base\Form\Traits;

use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;

use Symfony\Component\Form\Extension\Core\Type\CheckboxType;

trait RememberMeFormTrait
{
    public static function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('_remember_me', CheckboxType::class, [
                'mapped' => false,
                'required' => false,
                'attr' => ["checked" => "checked"]
            ]);
    }
}