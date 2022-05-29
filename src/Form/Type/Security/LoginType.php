<?php

namespace Base\Form\Type\Security;

use App\Entity\User;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormBuilderInterface;

use Symfony\Component\Form\AbstractType;

class LoginType extends AbstractType
{
    public function getBlockPrefix() : string { return "login"; }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'identifier' => null, // to pass variable from controller to Type
            'allow_extra_fields' => true
        ]);
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('identifier', TextType::class, [
                'attr'  => [
                    'id' => "inputUsername",  // used in Symfony kernel
                    'value' => $options["identifier"] ?? ""
                ]
            ])
            ->add('password', PasswordType::class, [
                'attr'  => [
                    'id' => "inputPassword"  // used in Symfony kernel
                ]
            ])
            ->add("_remember_me", CheckboxType::class, [
                    'mapped' => false,
                    'required' => false,
                    'attr' => ["checked" => "checked"]
            ]);
    }
}
