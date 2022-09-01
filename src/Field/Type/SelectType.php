<?php

namespace Base\Field\Type;

use App\Entity\User;
use App\Entity\User\Artist;
use App\Entity\User\Merchant;
use App\Enum\UserRole;
use Base\Controller\Backend\AbstractCrudController;
use Base\Database\Mapping\ClassMetadataManipulator;
use Base\Form\FormFactory;
use Base\Service\Model\Autocomplete;
use Base\Service\BaseService;
use Base\Service\LocaleProvider;
use Base\Service\ObfuscatorInterface;
use Base\Service\ParameterBagInterface;
use Base\Service\Translator;
use Base\Service\TranslatorInterface;
use Base\Twig\Environment;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Generator;
use Hashids\Hashids;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\DataMapperInterface;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationChecker;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Traversable;

class SelectType extends AbstractType implements DataMapperInterface
{
    /** @var ClassMetadataManipulator */
    protected $classMetadataManipulator;

    /** @var Environment */
    protected $twig;

    /** @var FormFactory */
    protected $formFactory;

    public function __construct(
        FormFactory $formFactory, EntityManagerInterface $entityManager, TranslatorInterface $translator,
        ClassMetadataManipulator $classMetadataManipulator, CsrfTokenManagerInterface $csrfTokenManager,
        LocaleProvider $localeProvider, AdminUrlGenerator $adminUrlGenerator,
        Environment $twig, AuthorizationChecker $authorizationChecker, ObfuscatorInterface $obfuscator, ParameterBagInterface $parameterBag, RouterInterface $router)
    {
        $this->classMetadataManipulator = $classMetadataManipulator;
        $this->csrfTokenManager = $csrfTokenManager;
        $this->twig = $twig;
        $this->translator = $translator;
        $this->entityManager = $entityManager;
        $this->obfuscator = $obfuscator;
        $this->parameterBag = $parameterBag;
        $this->authorizationChecker = $authorizationChecker;

        $this->formFactory = $formFactory;
        $this->localeProvider = $localeProvider;
        $this->adminUrlGenerator = $adminUrlGenerator;
        $this->router = $router;

        $this->autocomplete = new Autocomplete($this->translator);
    }

    public function getBlockPrefix(): string { return 'select2'; }

    protected static $icons = [];
    public static function getIcons(): array
    {
        $class = static::class;
        if(array_key_exists(self::$icons, self::$icons))
            return self::$icons[$class];
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([

            'class' => null,
            'class_priority' => [
                FormFactory::GUESS_FROM_FORM,
                FormFactory::GUESS_FROM_PHPDOC,
                FormFactory::GUESS_FROM_DATA,
                FormFactory::GUESS_FROM_VIEW,
            ],

            // To be implemented if necessary... (currently relying on autocomplete..)
            //'query_builder'   => null,
            "disable" => false,
            'choices'          => null,
            'choice_loader'    => null,
            'choice_filter'    => false,

            'choice_value'     => function($value)              { return $value; },   // Return key code
            'choice_label'     => function($value, $label, $id) { return $label; },   // Return translated label

            'select2'          => [],
            'select2-i18n'     => $this->parameterBag->get("base.vendor.select2.i18n"),
            'select2-js'       => $this->parameterBag->get("base.vendor.select2.javascript"),
            'select2-css'      => $this->parameterBag->get("base.vendor.select2.stylesheet"),
            'theme'            => $this->parameterBag->get("base.vendor.select2.theme"),
            'empty_data'       => null,

            // Generic parameters
            'placeholder'        => "@fields.select.placeholder",
            'capitalize'         => true,
            'language'           => null,
            'required'           => true,
            'multiple'           => null,
            'multivalue'         => false,

            'vertical'           => false,
            'maximum'            => 0,
            'tabulation'         => "1.75em",
            'tags'               => false,
            'minimumInputLength' => 0,
            'tokenSeparators'    => [' ', ',', ';'],
            'closeOnSelect'      => null,
            'selectOnClose'      => false,
            'minimumResultsForSearch' => 0,
            "dropdownCssClass"   => null,
            "containerCssClass"  => null,

            'html'               => true,
            'href'               => null,

            // Autocomplete
            'autocomplete'                     => null,
            'autocomplete_endpoint'            => "ux_autocomplete",
            'autocomplete_endpoint_parameters' => [],
            'autocomplete_fields'              => [],
            'autocomplete_data'                => null,
            'autocomplete_processResults'      => null,
            'autocomplete_delay'               => 500,
            'autocomplete_type'                => $this->router->isDebug() ? "GET" : "POST",

            // Sortable option
            'sortable'              => null
        ]);

        $resolver->setNormalizer('required', function (Options $options, $value) {
            if($value === null) return $options["tags"] !== false;
            return $value;
        });

        $resolver->setNormalizer('tokenSeparators', function (Options $options, $value) {

            if(is_array($options["tags"]) && $options["tags"]) return $options["tags"];
            return $value;
        });

        $resolver->setNormalizer('class', function (Options $options, $value) {
            if(!$this->classMetadataManipulator->isEntity($value)) return null;
            return $value;
        });
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->setDataMapper($this);
        $builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) use (&$options) {

            $form = $event->getForm();
            $options = $form->getConfig()->getOptions();

            // Guess class without data in the first place..
            // To make sure the form can return something in the worst case
            $options["guess_priority"] = array_intersect(
                [FormFactory::GUESS_FROM_FORM, FormFactory::GUESS_FROM_PHPDOC],
                $options["class_priority"]
            );

            // Guess some options
            $options["class"]    = $this->formFactory->guessClass($event, $options);
            $options["sortable"] = $this->formFactory->guessSortable($event, $options);
            $options["multiple"] = $this->formFactory->guessMultiple($form, $options);

            $options["choice_filter"] = $this->formFactory->guessChoiceFilter($form, $options);
            if(!$options["choices"] && $options["choice_loader"] === null) {

                $options["choices"] = $this->formFactory->guessChoices($form, $options);
                $options["autocomplete"]  = $this->formFactory->guessChoiceAutocomplete($form, $options);

                /* Override options.. I couldn't done that without accessing data */
                // It might be good to get read of that and be able to use normalizer.. as expected
                if(!$options["tags"] && !$options["choices"] && !$options["autocomplete"])
                    throw new \Exception("No choices, or autocomplete option, could be guessed without using data information for \"".$form->getName()."\"");
            }

            $formOptions = [
                'choices'       => [],
                'choice_loader' => $options["choice_loader"],
                'choice_label'  => $options["choice_label"],
                'choice_value'  => $options["choice_value"],
                'multiple'      => $options["multiple"]
            ];

            $form->add('choice', ChoiceType::class, $formOptions);
        });

        $builder->addEventListener(FormEvents::PRE_SUBMIT, function (FormEvent $event) use (&$options) {

            $form = $event->getForm();
            $data = $event->getData();

            // Guess including class_priority
            $options["guess_priority"] = $options["class_priority"];
            $options["class"]          = $this->formFactory->guessClass($event, $options);

            $dataChoice = $data["choice"] ?? null;
            $choicesData = $options["multiple"] ? $dataChoice ?? [] : [];
            if(!$options["multiple"] && $dataChoice) $choicesData[] = $dataChoice;

            if ($options["class"]) {

                $innerType = get_class($form->getConfig()->getType()->getInnerType());
                $dataset = $form->getData() instanceof Collection ? $form->getData()->toArray() : ( !is_array($form->getData()) ? [$form->getData()] : $form->getData() );
                if($this->classMetadataManipulator->isEntity($options["class"])) {

                    $classRepository = $this->entityManager->getRepository($options["class"]);
                    if ($dataset)
                        $dataset = $classRepository->findById($dataset)->getResult();
                }
                $formattedData = array_transforms(function ($key, $choices, $callback, $i, $d) use ($innerType, &$options) : Generator {

                    if($choices === null) return null;

                    // Recursive categories
                    if(is_array($choices)) {

                        list($class, $text) = array_pad(explode("::", $key), 2, null);

                             if($this->classMetadataManipulator->isEntity  ($class)) $text = $this->translator->transEntity($class, null, Translator::NOUN_PLURAL);
                        else if($this->classMetadataManipulator->isEnumType($class)) $text = $this->translator->transEnum  ($class, $text, Translator::NOUN_PLURAL);
                        else if($this->classMetadataManipulator->isSetType ($class)) $text = $this->translator->transEnum  ($class, $text, Translator::NOUN_PLURAL);

                        $text = empty($text) ? $key : $text;
                        $self = array_pop_key("_self", $choices);

                        if(! $self) yield null => ["text" => $text, "children" => array_transforms($callback, $choices, $d)];
                        else {

                            $yields = $callback(null, $self, $callback, $i, $d++);
                            foreach($yields as $yield)
                                yield null => $yield;

                            foreach(array_transforms($callback, $choices, $d) as $yield)
                                yield null => $yield;
                        }

                    } else {

                        // Format values
                        $entryFormat = $options["capitalize"] ? FORMAT_TITLECASE : FORMAT_SENTENCECASE;
                        $entry = $this->autocomplete->resolve($choices, $options["class"] ?? $innerType, [
                            "html" => $options["html"],
                            "format" => $entryFormat
                        ]);

                        if($entry === null) return null;

                        if(!$options["class"]) $entry["text"] = $key;
                        yield $entry["id"] => $entry["text"];
                    }

                }, $dataset ?? []);

                // Search missing information
                $missingData = [];
                $knownData = array_keys($formattedData);
                foreach($choicesData as $data) {

                    if(!in_array($data, $knownData))
                        $missingData[] = $data;
                }

                $innerType = $form->getConfig()->getType()->getInnerType();
                $formattedData += array_transforms(function ($key, $choices, $callback, $i, $d) use ($innerType, &$options): Generator {

                    // Recursive categories
                    if(is_array($choices)) {

                        list($class, $text) = array_pad(explode("::", $key), 2, null);

                             if($this->classMetadataManipulator->isEntity  ($class)) $text = $this->translator->transEntity($class, null, Translator::NOUN_PLURAL);
                        else if($this->classMetadataManipulator->isEnumType($class)) $text = $this->translator->transEnum  ($class, $text, Translator::NOUN_PLURAL);
                        else if($this->classMetadataManipulator->isSetType ($class)) $text = $this->translator->transEnum  ($class, $text, Translator::NOUN_PLURAL);

                        $text = empty($text) ? $key : $text;
                        $self = array_pop_key("_self", $choices);

                        if(! $self) yield null => ["text" => $text, "children" => array_transforms($callback, $choices, $d)];
                        else {

                            $yields = $callback(null, $self, $callback, $i, $d++);
                            foreach($yields as $yield)
                                yield null => $yield;

                            foreach(array_transforms($callback, $choices, $d) as $yield)
                                yield null => $yield;
                        }

                    } else {

                        // Format values
                        $entry = $this->autocomplete->resolve($choices, $options["class"] ?? $innerType, [
                            "html" => $options["html"],
                            "format" => $options["capitalize"] ? FORMAT_TITLECASE : FORMAT_SENTENCECASE
                        ]);

                        if($entry === null) return null;

                        if(!$options["class"]) $entry["text"] = $key;
                        yield $entry["id"] => $entry["text"];
                    }

                }, $missingData ?? []);

                //
                // Compute in choice list format
                $choices = array_filter(array_transforms(function($key, $choices) use($formattedData) : ?array {

                    $id    = $choices;
                    $label = $formattedData[$id] ?? null;

                    return [$label, $choices];

                }, $choicesData));


            } else {

                $choices = $choicesData;
            }

            //
            // Note for later: when disabling select2, it might happend that the label of the label of selected entries are wrong
            $formOptions = [
                'choices'  => $choices,
                'multiple' => $options["multiple"]
            ];

            $form->remove('choice')->add('choice', ChoiceType::class, $formOptions);
        });
    }

    public function mapDataToForms($viewData, Traversable $forms) { /* done in buildView due to select2 extend */ }
    public function mapFormsToData(Traversable $forms, &$viewData)
    {
        $choiceType = current(iterator_to_array($forms));
        if(!$this->formFactory->isOwningField($choiceType->getParent())) return;

        $options = $choiceType->getParent()->getConfig()->getOptions();
        $options["class"] = $this->formFactory->guessClass($choiceType->getParent());

        if(!$options["multiple"]) $choicesData = $choiceType->getViewData();
        else $choicesData = $options["multivalue"] ? array_map(fn($c) => explode("/", $c)[0], $choiceType->getViewData()) : array_unique($choiceType->getViewData());
        $multiple = $options["multiple"];

        if ($this->classMetadataManipulator->isEntity($options["class"])) {

            $classRepository = $this->entityManager->getRepository($options["class"]);

            $options["multiple"] = $options["multiple"] ?? $this->formFactory->guessMultiple($choiceType->getParent(), $options);
            if(!$options["multiple"]) $choicesData = $classRepository->findOneById($choicesData);
            else {

                $orderBy = array_flip($choicesData);
                $default = count($orderBy);

                $entities = [];
                if($choicesData)
                    $entities = $classRepository->findById($choicesData, [])->getResult();

                foreach($choicesData as $pos => $id) {

                    foreach($entities as $entity)
                        if($entity->getId() == $id) $choicesData[$pos] = $entity;
                }

                usort($choicesData, fn($a, $b) => ($orderBy[$a->getId()] ?? $default) <=> ($orderBy[$b->getId()] ?? $default));
            }
        }

        $options["multiple"] = $multiple !== null ? $multiple : null;
        $options["multiple"] = $this->formFactory->guessMultiple($choiceType->getParent(), $options);

        if($viewData instanceof Collection) {

            $viewData->clear();

            if(!is_iterable($choicesData))
                 $choicesData = $choicesData ? [$choicesData] : [];

            foreach($choicesData as $data)
                $viewData->add($data);

        } else if($options["multiple"]) {

            $viewData = [];
            foreach($choicesData as $data)
                $viewData[] = $data;

        } else $viewData = $choicesData;
    }

    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        /* Override options.. I couldn't done that without accessing data */
        $options["class"]         = $this->formFactory->guessClass($form, $options);
        $options["multiple"]      = $this->formFactory->guessMultiple($form, $options);
        $options["sortable"]      = $this->formFactory->guessSortable($form, $options);

        $options["choice_filter"] = $this->formFactory->guessChoiceFilter($form, $options);
        if(!$options["choices"] && $options["choice_loader"] === null) {
            $options["choices"]       = $this->formFactory->guessChoices($form, $options);
            $options["autocomplete"]  = $this->formFactory->guessChoiceAutocomplete($form, $options);
        }

        $data = $form->getData();

        // Set default data
        if($options["multiple"]) {

            if($options["empty_data"] === null)
                $options["empty_data"] = new ArrayCollection();
            else if (is_array($options["empty_data"]))
                $options["empty_data"] = new ArrayCollection($options["empty_data"]);
            else if(!$options["empty_data"] instanceof Collection)
                $options["empty_data"] = new ArrayCollection([$options["empty_data"]]);

            if($data instanceof Collection && $data->isEmpty()) {

                foreach($options["empty_data"] as $emptyData) {
                    if ($options["class"] && $emptyData instanceof $options["class"])
                        $data->add($emptyData);
                }
            }

        } else if($data === null) {

            if (is_array($options["empty_data"])) $data = $options["empty_data"];
            else if ($options["empty_data"] instanceof Collection) $data = $options["empty_data"]->first();
            else $data = $options["empty_data"];

            if ($options["class"] && !$data instanceof $options["class"])
                    $data = null;
        }

        if (!$form->isSubmitted() && $this->classMetadataManipulator->isEntity($options["class"]) && ($data && !$data instanceof Collection)) {

            $classRepository = $this->entityManager->getRepository($options["class"]);
            if($options["multiple"]) {

                $orderBy = array_flip($data ?? []);
                $default = count($orderBy);

                $viewData = [];
                if($data)
                    $viewData = $classRepository->findById($data, [])->getResult();

                usort($viewData, fn($a, $b) => ($orderBy[$a->getId()] ?? $default) <=> ($orderBy[$b->getId()] ?? $default));

            } else {

                $data = $classRepository->findOneById($data);
            }

            if(!$form->isSubmitted()) $form->setData($data);
        }

        if($options["select2"] !== null) {

            // Double-check for "multiple" option
            // * If database can accept multiples, it can also accept single elements
            // * But database with single entry cannot accept multiple elements.. So I arbitrarily keep only the first element..
            $multipleExpected = $data instanceof Collection || is_array($data);
            if($options["multiple"] == false &&  $multipleExpected && $data !== null) {
                $data = $data instanceof Collection ? $data->toArray() : $data;
                $data = first($data);
            }

            if($options["multiple"] == true  && !$multipleExpected && $data !== null)
                $data = null;

            //
            // Prepare variables
            $array = [
                "class"      => $options["class"],
                "fields"     => $options["autocomplete_fields"],
                "filters"    => $options["choice_filter"],
                'capitalize' => $options["capitalize"],
                "html"       => $options["html"],
                "token"      => $this->csrfTokenManager->getToken("select2")->getValue()
            ];

            $hash = $this->obfuscator->encode($array);

            //
            // Prepare select2 options
            $selectOpts = $options["select2"];
            $selectOpts["multiple"] = $options["multiple"] ? "multiple" : "";
            if($options["autocomplete"]) {

                $selectOpts["ajax"] = [
                    "url" => $this->router->generate($options["autocomplete_endpoint"], array_merge($options["autocomplete_endpoint_parameters"], ["hashid" => $hash])),
                    "type" => $options["autocomplete_type"],
                    "delay" => $options["autocomplete_delay"],
                    "dataType" => "json",
                    "html" => $options["html"],
                    "cache" => true
                ];

                if(!array_key_exists("autocomplete_data", $selectOpts) && $options["autocomplete_data"] !== null)
                    $selectOpts["ajax"]["data"] = $options["autocomplete_data"];
                if(!array_key_exists("autocomplete_processResults", $selectOpts) && $options["autocomplete_processResults"] !== null)
                    $selectOpts["ajax"]["processResults"] = $options["autocomplete_processResults"];
            }


            if(!array_key_exists("minimumResultsForSearch", $selectOpts))
                     $selectOpts["minimumResultsForSearch"] = $options["minimumResultsForSearch"];
            if(!array_key_exists("closeOnSelect", $selectOpts))
                     $selectOpts["closeOnSelect"] = $options["closeOnSelect"] ?? !$options["multiple"];
            if(!array_key_exists("selectOnClose", $selectOpts))
                     $selectOpts["selectOnClose"] = $options["selectOnClose"];
            if(!array_key_exists("dropdownCssClass", $selectOpts) && $options["dropdownCssClass"] !== null)
                     $selectOpts["dropdownCssClass"]  = $options["dropdownCssClass"];

            $selectOpts["containerCssClass"] = $selectOpts["containerCssClass"] ?? "";
            $selectOpts["dropdownCssClass"] = $selectOpts["dropdownCssClass"] ?? "";
            if($options["vertical"] != false)
                $selectOpts["containerCssClass"] .= " select2-selection--vertical";

            if($options["tags"] && !$options["autocomplete"] && empty($options["choices"])) {
                $selectOpts["containerCssClass"] .= " select2-selection--wrap";
                $selectOpts["dropdownCssClass"]  .= " select2-selection--hide";
            }

            if($options["tags"]) {
                $view->vars["tokenSeparators"] = $options["tokenSeparators"];
            }

            if(!array_key_exists("placeholder", $selectOpts) && $options["placeholder"] !== null)
                     $selectOpts["placeholder"] = $this->translator->trans($options["placeholder"] ?? "", [], "@fields");

            if(!array_key_exists("multivalue", $selectOpts) && $options["multivalue"] !== null)
                $selectOpts["multivalue"] = $options["multivalue"];

            if(!array_key_exists("language", $selectOpts))
                $selectOpts["language"] = $this->localeProvider->getLang($this->localeProvider->getLocale($options["language"]));

            if(!array_key_exists("tokenSeparators", $selectOpts))
                     $selectOpts["tokenSeparators"] = $selectOpts["tokenSeparators"] ?? $options["tokenSeparators"];
            if(!array_key_exists("allowClear", $selectOpts))
                     $selectOpts["allowClear"]  = (array_key_exists("required"       , $options) && !$options["required"]   ) ? true                      : false;
            if(!array_key_exists("maximum", $selectOpts))
                     $selectOpts["maximum"]     = (array_key_exists("maximum"        , $options) &&  $options["maximum"] > 0) ? $options["maximum"]         : "";
            if(!array_key_exists("tags", $selectOpts))
                     $selectOpts["tags"]        = (array_key_exists("tags"           , $options) &&  $options["tags"]       ) ? true                      : false;

            if(!array_key_exists("theme", $selectOpts))
                     $selectOpts["theme"] = $options["theme"];

            //
            // Format preselected values
            $selectedData  = [];
            $dataset = $data instanceof Collection ? $data->toArray() : ( !is_array($data) ? [$data] : $data );

            $innerType = get_class($form->getConfig()->getType()->getInnerType());
            $formattedData = array_transforms(function ($key, $choices, $callback, $i, $d) use ($innerType, $dataset, &$options, &$selectedData) : Generator {

                if(is_array($choices)) {

                    list($class, $text) = array_pad(explode("::", $key), 2, null);

                         if($this->classMetadataManipulator->isEntity  ($class)) $text = $this->translator->transEntity($class, null, Translator::NOUN_PLURAL);
                    else if($this->classMetadataManipulator->isEnumType($class)) $text = $this->translator->transEnum  ($class, $text, Translator::NOUN_PLURAL);
                    else if($this->classMetadataManipulator->isSetType ($class)) $text = $this->translator->transEnum  ($class, $text, Translator::NOUN_PLURAL);
                    else $text = is_string($key) ? $key : $text;

                    $self = array_pop_key("_self", $choices);
                    if(! $self) yield null => ["text" => $text, "children" => array_transforms($callback, $choices, $d)];
                    else {

                        $yields = $callback(null, $self, $callback, $i, $d++);
                        foreach($yields as $yield)
                            yield null => $yield;

                        foreach(array_transforms($callback, $choices, $d) as $yield)
                            yield null => $yield;
                    }

                } else {

                    // Format values
                    $entry = $choices;
                    $entryFormat = FORMAT_IDENTITY;
                    if ($options["capitalize"] !== null)
                        $entryFormat = $options["capitalize"] ? FORMAT_TITLECASE : FORMAT_SENTENCECASE;

                    $entry = $this->autocomplete->resolve($entry, $options["class"] ?? $innerType, [
                        "html" => $options["html"],
                        "format" => $entryFormat
                    ]);

                    if(!$entry) return null;

                    // Special text formatting
                    $fallback = is_string($key) ? $key : (is_string($choices) ? castcase($choices, $entryFormat) : $choices);
                    $entry["text"] = $entry["text"] ?? $fallback;

                    // Check if entry selected
                    $entry["depth"] = $d;
                    $entry["selected"] = false;
                    foreach($dataset as $data)
                        $entry["selected"] |= ($choices === $data);

                    if($entry["selected"])
                        $selectedData[]  = $entry["id"];

                    yield $i => $entry;
                }

            }, $options["choices"] ?? $dataset ?? []);

            $selectOpts["data"]     = $formattedData;
            $selectOpts["selected"] = $selectedData;

            //
            // Set select2 theme
            if($selectOpts["theme"] != "default" && $selectOpts["theme"] != "classic") {

                $themeCssFile = dirname($options["select2-css"]) . "/themes/select2-" . $selectOpts["theme"] . ".css";
                if(preg_match("/.*\/select2-(.*).css/", $selectOpts["theme"], $themeArray)) {

                    $selectOpts["theme"] = $themeArray[1];
                    $themeCssFile = $themeArray[0];
                }

                $this->twig->addHtmlContent("stylesheets:before", $themeCssFile);
            }

            //
            // Set controller url
            $crudController = AbstractCrudController::getCrudControllerFqcn($options["class"]);

            $href = null;
            if($options["href"] === null && $crudController && $this->authorizationChecker->isGranted(UserRole::ADMIN)) {

                $href = $this->adminUrlGenerator
                        ->unsetAll()
                        ->setController($crudController)
                        ->setAction(Action::EDIT)
                        ->setEntityId("{0}")
                        ->generateUrl();
            }

            //
            // Default select2 initialializer
            $view->vars["select2"]          = json_encode($selectOpts);
            $view->vars["select2-href"]     = $href;
            $view->vars["tabulation"]       = $options["tabulation"];
            $view->vars["disabled"]       = $options["disable"];

            // NB: Sorting elements is not working at the moment for multivalue SelectType, reason why I disable it here..
            $view->vars["select2-sortable"] = $options["sortable"] && $options["multivalue"] == false;

            // Import select2
            $this->twig->addHtmlContent("stylesheets:before", $options["select2-css"]);
            $this->twig->addHtmlContent("javascripts:head", $options["select2-js"]);
            $this->twig->addHtmlContent("javascripts:head", $options["select2-i18n"]."/".$selectOpts["language"].".js");
            $this->twig->addHtmlContent("javascripts:body", "bundles/base/form-type-select2.js");
        }
    }
}
