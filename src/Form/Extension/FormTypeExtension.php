<?php

namespace Base\Form\Extension;

use App\Enum\UserRole;
use Base\Database\Mapping\ClassMetadataManipulator;
use Base\Form\Common\FormModelInterface;
use Base\Form\FormFactory;
use Base\Service\BaseService;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\Options;

class FormTypeExtension extends AbstractTypeExtension
{
    /**
     * @var BaseService
     */
    protected $baseService;

    /**
     * @var FormFactory
     */
    protected $formFactory;

    /**
     * @var ClassMetadataManipulator
     */
    protected $classMetadataManipulator;
    public function __construct(BaseService $baseService, FormFactory $formFactory, ClassMetadataManipulator $classMetadataManipulator)
    {
        $this->baseService = $baseService;
        $this->formFactory = $formFactory;
        $this->classMetadataManipulator = $classMetadataManipulator;
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
            'form2'          => $this->baseService->getParameterBag("base.twig.use_form2"),
            'easyadmin'      => $this->baseService->getParameterBag("base.twig.use_ea")
        ]);

        $resolver->setDefaults([
            'form_flow'    => true,
            'form_flow_id' => '_flow_token',
            'validation_entity' => null
        ]);

        $resolver->setNormalizer('form_flow_id', function(Options $options, $value) {

            $formType = null;
            if(class_implements_interface($options["data_class"], FormModelInterface::class))
                $formType = camel2snake(str_rstrip(class_basename($options["data_class"]::getTypeClass()),"Type"));

            return $value == "_flow_token" ? $formType : $value;
        });
    }

    public function finishView(FormView $view, FormInterface $form, array $options)
    {
        $this->browseView( $view, $form, $options);
    }

    public function browseView(FormView $view, FormInterface $form, array $options)
    {
        if($options["form2"]) $this->applyForm2($view);
        if($options["easyadmin"]) $this->applyEA($view, $form);

        if($this->baseService->isDebug() && $this->baseService->isGranted(UserRole::ADMIN) && $this->baseService->getRouter()->isEasyAdmin()) {
            $this->markDbProperties($view, $form, $options);
            $this->markOptions($view, $form, $options);
        }

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

    public function applyForm2(FormView $view) {

        // Add to all form custom base style..
        // It is named form2 and blocks are available in ./templates/form/form_div_layout.html.twig
        if (array_search("form" , $view->vars['block_prefixes']) !== false &&
            array_search("form2", $view->vars['block_prefixes']) === false)
        {
            array_splice($view->vars['block_prefixes'], 1, 0, ["form2"]);
        }
    }

    public function applyEA(FormView $view, FormInterface $form) {

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

    public function markAsDbColumns(FormView $view, FormInterface $form, array $options) {

        $dataClass = $options["class"] ?? $form->getConfig()->getDataClass();
        if($this->classMetadataManipulator->isEntity($dataClass)) {

            $classMetadata = $this->classMetadataManipulator->getClassMetadata($dataClass);
            foreach($classMetadata->getFieldNames() as $fieldName) {

                $childView = $view->children[$fieldName] ?? null;
                if($childView) $childView->vars["is_dbcolumn"] = true;
            }

            foreach($classMetadata->getAssociationNames() as $fieldName) {

                $childView = $view->children[$fieldName] ?? null;
                if($childView) $childView->vars["is_dbcolumn"] = true;
            }
        }
    }

    public function markDbProperties(FormView $view, FormInterface $form, array $options) {

        $dataClass = $options["class"] ?? $form->getConfig()->getDataClass();
        if($this->classMetadataManipulator->isEntity($dataClass)) {

            $classMetadata = $this->classMetadataManipulator->getClassMetadata($dataClass);
            foreach($view->children as $childView) // Alias is marked by default and remove if field found..
                $childView->vars["is_alias"] = true;

            foreach($classMetadata->getFieldNames() as $fieldName) {

                $childView = $view->children[$fieldName] ?? null;
                if($childView) $childView->vars["is_dbcolumn"] = true;

                unset($childView->vars["is_alias"]);
            }

            foreach($classMetadata->getAssociationNames() as $fieldName) {

                $childView = $view->children[$fieldName] ?? null;
                if($childView) $childView->vars["is_dbcolumn"] = true;

                unset($childView->vars["is_alias"]);
            }
        }
    }

    public function markOptions(FormView $view, FormInterface $form, array $options) {

        if($this->formFactory->guessSortable($form, $options)) $view->vars["is_sortable"] = true;
        if($this->formFactory->guessMultiple($form, $options)) $view->vars["is_multiple"] = true;
        if($form->getData() instanceof Collection && !$this->classMetadataManipulator->isCollectionOwner($form, $form->getData()))
            $view->vars["is_inherited"] = true;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        // if (!$options["form_flow"]) return;
        // if (!$builder->getForm()->isRoot()) return;

        // /**
        //  * @var FormFlowInterface
        //  */
        // $form = $builder->getForm();
        // $step = $form->getStep($options);
        // $token = $form->getToken($options);

        // $builder->add($options['form_flow_name'], HiddenType::class, [
        //             'mapped' => false,
        //             "attr" => ["value" => $token."#". $step]
        //         ]);

        // if(array_key_exists($step, $form->flowCallbacks))
        //     call_user_func($form->flowCallbacks[$step], $builder, $options);
    }
}
