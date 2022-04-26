<?php

namespace Base\Field\Type;

use InvalidArgumentException;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolver;

class QuadrantType extends ImageType
{
    public function getBlockPrefix(): string { return 'quadrant'; }
    public function getParent() : ?string { return ImageType::class; }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'thumbnail'   => "bundles/base/user.svg",
            'cropper'     => null,
            "lightbox" => null
        ]);
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        if($options["multiple"])
            throw new InvalidArgumentException("There can be only one picture for quadrant type, please disable 'multiple' option");
    }

    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        parent::buildView($view, $form, $options);
        
        //
        // VIEW: 
        // - <id>_raw  = file,
        // - <id>_file = hidden,
        // - <id>_deleteBtn = btn "x",
        // - <id>_deleteQuadrantBtn = btn "x",
        // - <id>_figcaption = btn "+"
        // - dropzone: <id>_dropzone = btn "x",
        // - cropper: <id>_modal     = modal
        // - cropper: <id>_cropper   = cropper
        // - cropper: <id>_thumbnail = thumbnail
        //
        $view->vars['quadrant'] = $view->vars['files'][0] ?? null;
        $view->vars['files']  = [];

        if(!($view->vars["accept"] ?? false) ) 
             $view->vars["accept"] = "image/*";

        $view->vars["thumbnail"] = $options["thumbnail"];
        $view->vars["cropper"] = ($options["cropper"] !== null);

        $this->baseService->addHtmlContent("javascripts:body", "bundles/base/form-type-quadrant.js");
    }
}