<?php

namespace Base\Field\Type;

use Base\Form\FormFactory;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Base\Service\BaseService;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;

/**
 * @author Jonathan Scheiber <contact@jmsche.fr>
 */
final class ColorType extends AbstractType
{
    /** @var BaseService */
    protected $baseService;
    public function __construct(BaseService $baseService) { $this->baseService = $baseService; }

    public function getBlockPrefix(): string
    {
        return 'jscolor';
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'jscolor'     => [],
            'jscolor-js'  => $this->baseService->getParameterBag("base.vendor.jscolor.js"),
            'empty_data'  => "#00000000",
            'is_nullable' => true
        ]);
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->addEventListener(FormEvents::PRE_SUBMIT, function (FormEvent $event) use (&$options) {

            if ($event->getData() == $options["empty_data"] && $options["is_nullable"])
                $event->setData(null);
        });
    }

    public function buildView(FormView $view, FormInterface $form, array $options): void
    {
        // JSColor requirement
        $view->vars['attr']['data-jscolor'] = json_encode($options["jscolor"]);

        // JSColor class for stylsheet
        $view->vars['attr']["class"] = "form-color";

        // Add alpha channel by default
        switch( strlen($view->vars['value']) ) {
            case 4:
                $view->vars['value'] .= "F";
                break;
            case 7:
                $view->vars['value'] .= "FF";
                break;
            case 9:
                break;
            default:
                $view->vars['value'] = "#00000000";
        }
        $options["value"] = $view->vars['value'];

        // Import JSColor
        $this->baseService->addHtmlContent("javascripts", $options["jscolor-js"]);

    }

    public function getParent() : ?string
    {
        return TextType::class;
    }
}
