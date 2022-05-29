<?php

namespace Base\Form\Extension;

use Base\Service\BaseService;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormBuilderInterface;

use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;

use Symfony\Component\Form\AbstractTypeExtension;

use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;

use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;


class FormTypeExtension extends AbstractTypeExtension
{
    protected $defaultEnabled;
    public function __construct(BaseService $baseService)
    {
        $this->baseService = $baseService;
    }

    /**
     * {@inheritdoc}
     */
    public static function getExtendedTypes(): iterable
    {
        return [FormType::class];
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'form2' => $this->baseService->getParameterBag("base.twig.use_form2"),
            'easyadmin' => $this->baseService->getParameterBag("base.twig.use_ea")
        ]);
    }

    public function finishView(FormView $view, FormInterface $form, array $options)
    {

        $this->browseView( $view, $form, $options);
    }

    public function browseView(FormView $view, FormInterface $form, array $options)
    {
        if($options["form2"]) $this->applyForm2($view);
        if($options["easyadmin"]) $this->applyEA($form, $view);

        foreach($view->children as $field => $childView) {

            if (!$form->has($field))
                continue;

            $childForm = $form->get($field);
            $childOptions = $childForm->getConfig()->getOptions();
            $childOptions["form2"] = $options["form2"];
            $childOptions["easyadmin"] = $options["easyadmin"];

            $this->browseView($childView, $childForm, $childOptions);
        }
    }

    public function applyForm2($view) {

        // Add to all form custom base style..
        // It is named form2 and blocks are available in ./templates/form/form_div_layout.html.twig
        if (array_search("form" , $view->vars['block_prefixes']) !== false &&
            array_search("form2", $view->vars['block_prefixes']) === false)
        {
            array_splice($view->vars['block_prefixes'], 1, 0, ["form2"]);
        }
    }

    public function applyEA($form, $view) {

        if(!empty($view->vars["ea_crud_form"])) {

            if(!$form->getParent()) {
                if(!array_key_exists("class", $view->vars["attr"]))
                    $view->vars["attr"]["class"] = "";

                $view->vars["attr"]["class"] .= " row ";
            }
        }

        $fieldDto = $view->vars["ea_crud_form"]["ea_field"] ?? null;
        if($fieldDto) {

            $columns = $fieldDto->getColumns() ?? $fieldDto->getDefaultColumns() ?? "";
            if(!array_key_exists("class", $view->vars["row_attr"]))
                $view->vars["row_attr"]["class"] = "";

            $view->vars["row_attr"]["class"] .= " ".$columns;
        }
    }
}
