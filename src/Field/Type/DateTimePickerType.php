<?php

namespace Base\Field\Type;

use Base\Service\BaseService;
use Symfony\Component\Config\Definition\Exception\Exception;

use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\TimeType;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\Extension\Core\DataTransformer\ArrayToPartsTransformer;
use Symfony\Component\Form\Extension\Core\DataTransformer\DataTransformerChain;
use Symfony\Component\Form\Extension\Core\DataTransformer\DateTimeToArrayTransformer;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;

use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;


class DateTimePickerType extends AbstractType
{
    /** @var BaseService */
    protected $baseService;
    public function __construct(BaseService $baseService)
    {
        $this->baseService = $baseService;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'moment-js'    => $this->baseService->getParameterBag("base.vendor.moment.js"),
            'datetimepicker-format' => "YYYY-MM-DD HH:mm:ss", // JS Datetime Format
            'datetimepicker-js'    => $this->baseService->getParameterBag("base.vendor.datetimepicker.js"),
            'datetimepicker-css'   => $this->baseService->getParameterBag("base.vendor.datetimepicker.css"),

            // PHP Datetime format:
            // This format is replacing the shitty HTML5_FORMAT :-)
            "format" => "yyyy-MM-dd HH:mm:ss",
            "html5"  => false,
            "widget" => "single_text"
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function getParent()
    {
        return DateTimeType::class;
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'datetimepicker';
    }

    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        // Import datetimepicker
        $this->baseService->addHtmlContent("javascripts", $options["moment-js"]);
        $this->baseService->addHtmlContent("javascripts", $options["datetimepicker-js"]);
        $this->baseService->addHtmlContent("stylesheets", $options["datetimepicker-css"]);

        $format = $options["datetimepicker-format"];
        $value = $view->vars["value"];

        //
        // Datetime picker initialializer
        $this->baseService->addHtmlContent("javascripts:body", 
        "<script>
            $(function () {

                var parent = $('#" . $view->vars['id'] . "').parent();
                $(parent).css('position', 'relative');

                $('#".$view->vars['id']. "').datetimepicker({
                    format: \"".$format. "\",
                    defaultDate: \"$value\",
                    sideBySide: true
                });
            });
        </script>");
    }
}
