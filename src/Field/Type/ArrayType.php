<?php

namespace Base\Field\Type;

use Base\Database\Mapping\ClassMetadataManipulator;
use Base\Service\TranslatorInterface;
use Base\Twig\Environment;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Exception;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;

use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Security\Core\Authorization\AuthorizationChecker;

class ArrayType extends CollectionType
{
    /**
     * @var ClassMetadataManipulator
     */
    protected ClassMetadataManipulator $classMetadataManipulator;

    public function __construct(Environment $twig, TranslatorInterface $translator, AuthorizationChecker $authorizationChecker, AdminUrlGenerator $adminUrlGenerator, ClassMetadataManipulator $classMetadataManipulator)
    {
        parent::__construct($twig, $translator, $authorizationChecker, $adminUrlGenerator);
        $this->classMetadataManipulator = $classMetadataManipulator;
    }

    public function getBlockPrefix(): string
    {
        return 'array';
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        parent::configureOptions($resolver);

        $resolver->setDefaults([
            "target" => null,
            "associative" => null,
            "allow_add" => true,
            "allow_delete" => true,
            'entry_type' => TextType::class,
            "pattern" => null,
            "length" => 0,
            "placeholder" => []
        ]);

        $resolver->setNormalizer('target', function (Options $options, $value) {
            if ($options["pattern"] !== null && $value !== null) {
                throw new Exception("Option \"target\" cannot be set at the same time as \"pattern\"");
            }
        });

        $resolver->setNormalizer('length', fn(Options $options, $value) => $options["pattern"] ? $this->getNumberOfArguments($options["pattern"]) : $value);
        $resolver->setNormalizer('allow_add', fn(Options $options, $value) => $options["length"] == 0 && $value);
        $resolver->setNormalizer('allow_delete', fn(Options $options, $value) => $options["length"] == 0 && $value);
    }

    public function buildFormArray(FormBuilderInterface $builder, array $options)
    {
        $builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) use (&$options) {
            $data = $event->getData() ?? [];
            $event->setData(array_values($data));
        });

        parent::buildForm($builder, $options);
    }

    public function buildFormAssociativeArray(FormBuilderInterface $builder, array $options)
    {
        $data = [];
        $builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) use (&$data) {
            $data = $event->getData();
            $event->setData([]);
        });
        parent::buildForm($builder, $options);
        $builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) use (&$data) {
            $event->setData($data);
        });

        $prototypeOptions = $options['entry_options'];
        if (null !== $options['prototype_data']) {
            $prototypeOptions['data'] = $options['prototype_data'];
        }

        if (null !== $options['entry_required']) {
            $prototypeOptions['required'] = $options['entry_required'];
        }

        $prototypeOptions["attr"]['placeholder'] = $prototypeOptions['attr']['placeholder'] ?? $this->translator->trans("@fields.array.value");
        $prototype = $builder->create($options['prototype_name'], FormType::class, ["label" => false])
            ->add("key", TextType::class, ["label" => false, "attr" => ["placeholder" => $this->translator->trans("@fields.array.key")]])
            ->add("value", $options['entry_type'], $prototypeOptions);

        $builder->setAttribute('prototype', $prototype->getForm());
        $builder->add($prototype);

        $builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) use (&$options, $builder, $prototypeOptions) {
            $form = $event->getForm();
            $data = $event->getData();

            $data = array_transforms(fn($key, $entry): array => [null, [
                "key" => is_array($entry) ? ($entry["key"] ?? null) : $key,
                "value" => is_array($entry) ? ($entry["value"] ?? first($entry) ?? null) : $entry,
            ]], $data);

            $event->setData($data);

            foreach ($data ?? [] as $id => $element) {
                $form->add(
                    $builder->create($id, FormType::class, ["label" => false, 'auto_initialize' => false])
                        ->add("key", TextType::class, ["label" => false, "attr" => ["placeholder" => $this->translator->trans("@fields.array.key")]])
                        ->add("value", $options['entry_type'], $prototypeOptions)->getForm()
                );
            }
        });

        $builder->addEventListener(FormEvents::PRE_SUBMIT, function (FormEvent $event) use (&$options, $builder, $prototypeOptions) {
            $form = $event->getForm();
            $data = $event->getData();

            foreach ($data ?? [] as $id => $element) {
                $form->add(
                    $builder->create($id, FormType::class, ["label" => false, 'auto_initialize' => false])
                        ->add("key", TextType::class, ["label" => false, "attr" => ["placeholder" => $this->translator->trans("@fields.array.key")]])
                        ->add("value", $options['entry_type'], $prototypeOptions)->getForm()
                );
            }
        });

        $builder->addEventListener(FormEvents::SUBMIT, function (FormEvent $event) use (&$options, $builder, $prototypeOptions) {
            $event->setData(
                array_transforms(fn($k, $v): array => [
                    first($v) ?? null,
                    second($v) ?? null
                ], $event->getData())
            );
        });
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        if ($options['associative']) {
            $this->buildFormAssociativeArray($builder, $options);
        } else {
            $this->buildFormArray($builder, $options);
        }
    }

    public function getNumberOfArguments($pattern): int
    {
        return preg_match_all('/\{[0-9]*\}/i', $pattern);
    }

    public function finishView(FormView $view, FormInterface $form, array $options)
    {
        parent::finishView($view, $form, $options);

        $view->vars['length'] = is_string($options["length"]) ? explode(".", $options["length"]) : $options["length"];
        $view->vars["pattern"] = $options["pattern"];
        $view->vars["placeholder"] = $options["placeholder"];
        $view->vars["associative"] = $options['associative'];
    }
}
