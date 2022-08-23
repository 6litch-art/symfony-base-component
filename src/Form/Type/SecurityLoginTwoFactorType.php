<?php

namespace Base\Form\Type;

use App\Entity\User;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormBuilderInterface;

use Symfony\Component\Form\AbstractType;

class SecurityLoginTwoFactorType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class
        ]);
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('totpSecret', PasswordType::class, [
            "attr" => ["placeholder" => "Code 2FA"]
        ]);
    }
}
