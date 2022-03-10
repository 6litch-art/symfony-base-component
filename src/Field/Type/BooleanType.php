<?php

namespace Base\Field\Type;

use Base\Service\BaseService;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;

class BooleanType extends AbstractType
{
    public function __construct(BaseService $baseService) { $this->baseService = $baseService; }

    public function getBlockPrefix(): string { return 'boolean'; }
    public function getParent() : ?string { return CheckboxType::class; }

    public function configureOptions(OptionsResolver $resolver) {

        $resolver->setDefaults([
            "confirmation[onCheck]" => true,
            "confirmation[onUncheck]" => true,
            "switch" => true
        ]);
    }

    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        $view->vars["switch"] = $options["switch"];
        $view->vars["confirmation_check"] = $options["confirmation[onCheck]"];
        $view->vars["confirmation_uncheck"] = $options["confirmation[onUncheck]"];

        $this->baseService->addHtmlContent("javascripts:body", "bundles/base/form-type-boolean.js");
    }
}
