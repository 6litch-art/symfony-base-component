<?php

namespace Base\Form\Type\User;

use App\Entity\User;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;

use Base\Form\AbstractType;
use Base\Form\Traits\CsrfFormTrait;
use Base\Form\Traits\BootstrapFormTrait;

class ProfileType extends AbstractType
{
    use BootstrapFormTrait;
    use CsrfFormTrait;

    public function configureOptions(OptionsResolver $resolver)
    {
        parent::configureOptions($resolver);

        $resolver->setDefaults([
            'data_class' => User::class,
            'csrf_token_id' => "user_profile"
        ]);
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);
    }

    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        parent::buildView($view, $form, $options);
    }

    public function finishView(FormView $view, FormInterface $form, array $options)
    {
        parent::finishView($view, $form, $options);
    }
}
