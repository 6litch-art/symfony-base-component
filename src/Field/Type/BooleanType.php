<?php

namespace Base\Field\Type;

use Base\Twig\Environment;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class BooleanType extends AbstractType
{
    /** @var Environment */
    protected $twig;

    public function __construct(Environment $twig)
    {
        $this->twig = $twig;
    }

    public function getBlockPrefix(): string
    {
        return 'boolean';
    }
    public function getParent(): ?string
    {
        return CheckboxType::class;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            "confirmation[onCheck]"   => true,
            "confirmation[onUncheck]" => true,
            "toogle_url"              => null,
            "switch"                  => true,
            "inline"                  => false,
            "required" => false
        ]);
    }

    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        $view->vars["switch"] = $options["switch"];
        $view->vars["confirmation_check"] = $options["confirmation[onCheck]"];
        $view->vars["confirmation_uncheck"] = $options["confirmation[onUncheck]"];
        $view->vars["toogle_url"] = $options["toogle_url"];
        $view->vars["inline"] = $options["inline"];
    }
}
