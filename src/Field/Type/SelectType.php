<?php

namespace Base\Field\Type;

use Base\Database\Factory\ClassMetadataManipulator;
use Base\Database\Type\EnumType;
use Base\Database\Type\SetType;
use Base\Form\FormFactory;
use Base\Model\AutocompleteInterface;
use Base\Model\IconizeInterface;
use Base\Model\SelectInterface;
use Base\Service\BaseService;
use Base\Service\LocaleProvider;
use Base\Service\Translator;
use Base\Service\TranslatorInterface;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\PersistentCollection;

use Hashids\Hashids;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\ChoiceList\ChoiceList;
use Symfony\Component\Form\ChoiceList\Loader\IntlCallbackChoiceLoader;
use Symfony\Component\Form\DataMapperInterface;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Traversable;

class SelectType extends AbstractType implements DataMapperInterface
{
    /** @var ClassMetadataManipulator */
    protected $classMetadataManipulator;

    /** @var BaseService */
    protected $baseService;

    /** @var FormFactory */
    protected $formFactory;
    
    public function __construct(FormFactory $formFactory, EntityManagerInterface $entityManager, TranslatorInterface $translator, ClassMetadataManipulator $classMetadataManipulator, CsrfTokenManagerInterface $csrfTokenManager, LocaleProvider $localeProvider, BaseService $baseService)
    {
        $this->classMetadataManipulator = $classMetadataManipulator;
        $this->csrfTokenManager = $csrfTokenManager;
        $this->baseService = $baseService;
        $this->translator = $translator;
        $this->entityManager = $entityManager;
        $this->hashIds = new Hashids();

        $this->formFactory = $formFactory;
        $this->localeProvider = $localeProvider;
    }

    public function getBlockPrefix(): string { return 'select2'; }

    public function encode(array $array) : string { return $this->hashIds->encodeHex(bin2hex(serialize($array)));  }
    public function decode(string $hash): array   { return unserialize(hex2bin($this->hashIds->decodeHex($hash))); }

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

            'choices'          => null,
            'choice_loader'    => null,
            'choice_filter'    => false,
            'choice_exclusive' => true,

            'choice_value'     => function($value)              { return $value; },   // Return key code
            'choice_label'     => function($value, $label, $id) { return $label; },   // Return translated label

            'select2'          => [],
            'select2-js'       => $this->baseService->getParameterBag("base.vendor.select2.js"),
            'select2-css'      => $this->baseService->getParameterBag("base.vendor.select2.css"),
            'theme'            => $this->baseService->getParameterBag("base.vendor.select2.theme"),

            // Generic parameters
            'placeholder'        => "@fields.select.placeholder",
            'capitalize'         => true,
            'language'           => null,
            'required'           => true,
            'multiple'           => null,
            'vertical'           => false,
            'maximum'            => 0,
            'tags'               => false,
            'minimumInputLength' => 0,
            'tokenSeparators'    => [' ', ',', ';'],
            'closeOnSelect'      => null,
            'selectOnClose'      => false,
            'minimumResultsForSearch' => 0,
            "dropdownCssClass"   => null,
            "containerCssClass"  => null,

            // Autocomplete 
            'autocomplete'          => null,
            'autocomplete_endpoint' => "autocomplete",
            'autocomplete_fields'   => [],
            'autocomplete_delay'    => 500,
            'autocomplete_type'     => $this->baseService->isDebug() ? "GET" : "POST",

            // Sortable option
            'sortable'              => null
        ]);

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
            $data = $event->getData();
            
            // Guess class without data in the first place.. 
            // To make sure the form can return something in the worst case
            $options["guess_priority"] = array_intersect(
                [FormFactory::GUESS_FROM_FORM, FormFactory::GUESS_FROM_PHPDOC], 
                $options["class_priority"]
            );

            // Guess class option
            $options["class"]    = $this->formFactory->guessType($event, $options);
            $options["sortable"] = $this->formFactory->guessSortable($event, $options);
            
            // Guess multiple option
            $options["multiple"]      = $this->formFactory->guessMultiple($form, $options);
            $multipleExpected = $data !== null || $data instanceof Collection || is_array($data);
            if($options["multiple"] && !$multipleExpected) 
                throw new \Exception("Data is not a collection in \"".$form->getName()."\" field and you required the option \"multiple\".. Please set multiple to \"false\"");

            $options["choice_filter"] = $this->formFactory->guessChoiceFilter($form, $options, $data);

            if(!$options["choices"] && $options["choice_loader"] === null) {

                $options["choices"] = $this->formFactory->guessChoices($form, $options);
                $options["autocomplete"]  = $this->formFactory->guessChoiceAutocomplete($form, $options);

                /* Override options.. I couldn't done that without accessing data */
                // It might be good to get read of that and be able to use normalizer.. as expected
                if(!$options["choices"] && !$options["autocomplete"]) 
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
            $options["class"]          = $this->formFactory->guessType($event, $options);

            $dataChoice = $data["choice"] ?? null;
            $choiceData = $options["multiple"] ? $dataChoice ?? [] : [];
            if(!$options["multiple"] && $dataChoice) $choiceData[] = $dataChoice;

            if ($options["class"]) {

                $innerType = get_class($form->getConfig()->getType()->getInnerType());
                $dataset = $form->getData() instanceof Collection ? $form->getData()->toArray() : ( !is_array($form->getData()) ? [$form->getData()] : $form->getData() );
                $formattedData = array_transforms(function ($key, $value, $i, $callback) use ($innerType, &$options) : ?array { 

                    if($value === null) return null;

                    // Recursive categories
                    if(is_array($value)) {

                        $text = null;
                        if(class_exists($key)) {

                            $text = null;
                            if($this->classMetadataManipulator->isEntity($key)  ) $text = $this->translator->entity($key, Translator::TRANSLATION_PLURAL); 
                            if($this->classMetadataManipulator->isEnumType($key)) $text = $this->translator->enum  (null, $key, Translator::TRANSLATION_PLURAL);
                            if($this->classMetadataManipulator->isSetType($key) ) $text = $this->translator->enum  (null, $key, Translator::TRANSLATION_PLURAL);
                        }

                        $text = empty($text) ? $key : $text;
                        return [null, ["text" => $text, "children" => array_transforms($callback, $value)]];
                    }

                    // Format values
                    $entry = self::getFormattedValues($value, $options["class"] ?? $innerType, $this->translator, $options["capitalize"] ? FORMAT_TITLECASE : FORMAT_SENTENCECASE);
                    if($entry === null) return null;

                    if(!$options["class"]) $entry["text"] = $key;
                    return [$entry["id"], $entry["text"]];

                }, $dataset ?? []);

                // Search missing information
                $missingData = [];
                $knownData = array_keys($formattedData);
                foreach($choiceData as $data) {
                    
                    if(!in_array($data, $knownData))
                        $missingData[] = $data;
                }

                if($this->classMetadataManipulator->isEntity($options["class"])) {

                    $classRepository = $this->entityManager->getRepository($options["class"]);
                    $missingData = $classRepository->findById($missingData)->getResult();
                }

                $innerType = $form->getConfig()->getType()->getInnerType();
                $formattedData += array_transforms(function ($key, $value, $i, $callback) use ($innerType, &$options) : array { 

                    // Recursive categories
                    if(is_array($value)) {

                        $text = null;
                        if(class_exists($key)) {

                            $text = null;
                            if($this->classMetadataManipulator->isEntity($key)  ) $text = $this->translator->entity($key, Translator::TRANSLATION_PLURAL); 
                            if($this->classMetadataManipulator->isEnumType($key)) $text = $this->translator->enum  (null, $key, Translator::TRANSLATION_PLURAL);
                            if($this->classMetadataManipulator->isSetType($key) ) $text = $this->translator->enum  (null, $key, Translator::TRANSLATION_PLURAL);
                        }

                        $text = empty($text) ? $key : $text;
                        return [null, ["text" => $text, "children" => array_transforms($callback, $value)]];
                    }

                    // Format values
                    $entryFormat = $options["capitalize"] ? FORMAT_TITLECASE : FORMAT_SENTENCECASE;
                    $entry = self::getFormattedValues($value, $options["class"] ?? $innerType, $this->translator, $entryFormat);

                    if(!$options["class"]) $entry["text"] = $key;
                    return [$entry["id"], $entry["text"]];

                }, $missingData ?? []);

                //
                // Compute in choice list format
                $choices = array_filter(array_transforms(function($key, $value) use($formattedData) : ?array {

                    $id    = $value;
                    $label = $formattedData[$id] ?? null;
                    if($label === null) return null;

                    return [$label, $value];

                }, $choiceData));

            } else {

                $choices = $choiceData;
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

    public function mapDataToForms($viewData, Traversable $forms) { }

    public function mapFormsToData(Traversable $forms, &$viewData)
    {
        $choiceType = current(iterator_to_array($forms));
        $choiceData = $choiceType->getViewData();

        $options = $choiceType->getConfig()->getOptions();
        $options["class"] = $this->formFactory->guessType($choiceType->getParent());

        if ($this->classMetadataManipulator->isEntity($options["class"])) {

            $options["multiple"] = $options["multiple"] ?? $this->formFactory->guessMultiple($choiceType->getParent(), $options);

            $classRepository = $this->entityManager->getRepository($options["class"]);
            if($options["multiple"]) {

                $orderBy = array_flip($choiceData);
                $default = count($orderBy);
                $choiceData = $classRepository->findById($choiceData, [])->getResult();
                usort($choiceData, fn($a, $b) => ($orderBy[$a->getId()] ?? $default) <=> ($orderBy[$b->getId()] ?? $default));
                
            } else {
                $choiceData = $classRepository->findOneById($choiceData);
            }
        }

        if($viewData instanceof Collection) {
        
            $viewData->clear();
            foreach($choiceData as $data)
                $viewData->add($data);

        } else if($options["multiple"]) {

            $viewData = [];
            foreach($choiceData as $data)
                $viewData[] = $data;

        } else $viewData = $choiceData;
    }

    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        if($options["select2"] !== null) {

            /* Override options.. I couldn't done that without accessing data */
            $options["class"]         = $this->formFactory->guessType($form, $options);
            $options["multiple"]      = $this->formFactory->guessMultiple($form, $options);
            $options["sortable"]      = $this->formFactory->guessSortable($form, $options);
            $options["autocomplete"]  = $this->formFactory->guessChoiceAutocomplete($form, $options);
            $options["choice_filter"] = $this->formFactory->guessChoiceFilter($form, $options, $form->getData());
            $options["choices"]       = $this->formFactory->guessChoices($form, $options);

            $multipleExpected = $form->getData() instanceof Collection || is_array($form->getData());
            if($options["multiple"] && !$multipleExpected)
                throw new \Exception("Data is not a collection in \"".$form->getName()."\" field and you required the option \"multiple\".. Please set multiple to \"false\"");

            //
            // Prepare variables
            $array = [
                "class" => $options["class"], 
                "fields" => $options["autocomplete_fields"],
                "filters" => $options["choice_filter"],
                'capitalize' => $options["capitalize"],
                "token" => $this->csrfTokenManager->getToken("select2")->getValue()
            ];

            $hash = $this->encode($array);

            //
            // Prepare select2 options
            $selectOpts = $options["select2"];
            $selectOpts["multiple"] = $options["multiple"] ? "multiple" : "";
            if($options["autocomplete"]) {

                $selectOpts["ajax"] = [
                    "url" => $this->baseService->getAsset($options["autocomplete_endpoint"])."/".$hash,
                    "type" => $options["autocomplete_type"],
                    "delay" => $options["autocomplete_delay"],
                    "data" => "function (args) { return {term: args.term, page: args.page || 1}; }",
                    "dataType" => "json",
                    "cache" => true,
                ];
            }

            if(!array_key_exists("minimumResultsForSearch", $selectOpts))
                     $selectOpts["minimumResultsForSearch"] = $options["minimumResultsForSearch"];
            if(!array_key_exists("closeOnSelect", $selectOpts))
                     $selectOpts["closeOnSelect"] = $options["closeOnSelect"] ?? !$options["multiple"];
            if(!array_key_exists("selectOnClose", $selectOpts))
                     $selectOpts["selectOnClose"] = $options["selectOnClose"];
            if(!array_key_exists("dropdownCssClass", $selectOpts) && $options["dropdownCssClass"] !== null)
                     $selectOpts["dropdownCssClass"]  = $options["dropdownCssClass"];
            
            $selectOpts["containerCssClass"] = "";
            if($options["vertical"] != false)
                $selectOpts["containerCssClass"] .= " select2-selection--vertical";

            if(!array_key_exists("placeholder", $selectOpts) && $options["placeholder"] !== null)
                     $selectOpts["placeholder"] = $this->translator->trans($options["placeholder"] ?? "", [], "@fields");

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
            $dataset = $form->getData() instanceof Collection ? $form->getData()->toArray() : ( !is_array($form->getData()) ? [$form->getData()] : $form->getData() );

            $innerType = get_class($form->getConfig()->getType()->getInnerType());
            $formattedData = array_transforms(function ($key, $value, $i, $callback) use ($innerType, $dataset, &$options, &$selectedData) : ?array { 

                // Recursive categories
                if(is_array($value)) {

                    $text = null;
                    if(class_exists($key)) {

                        $text = null;
                        if($this->classMetadataManipulator->isEntity($key)  ) $text = $this->translator->entity(      $key, Translator::TRANSLATION_PLURAL); 
                        if($this->classMetadataManipulator->isEnumType($key)) $text = $this->translator->enum  (null, $key, Translator::TRANSLATION_PLURAL);
                        if($this->classMetadataManipulator->isSetType($key) ) $text = $this->translator->enum  (null, $key, Translator::TRANSLATION_PLURAL);
                    }

                    $text = empty($text) ? $key : $text;
                    return [null, ["text" => $text, "children" => array_transforms($callback, $value)]];
                }

                // Format values
                $entryFormat = $options["capitalize"] ? FORMAT_TITLECASE : FORMAT_SENTENCECASE;
                $entry = self::getFormattedValues($value, $options["class"] ?? $innerType, $this->translator, $entryFormat);
                if(!$entry) return null;

                // Check if entry selected
                $entry["selected"] = false;
                foreach($dataset as $data)
                    $entry["selected"] |= ($value === $data);
            
                if($entry["selected"])
                    $selectedData[]  = $entry["id"];

                // Special display if no class/innerType found
                if(!array_key_exists("text", $entry))
                    $entry["text"] = $key;
                if(!array_key_exists("text", $entry))
                    $entry["icon"] = $value;

                return [$i, $entry];

            }, $options["choices"] ?? $dataset ?? []);

            if(count($formattedData) == 1 && array_key_exists("children", $formattedData))
                $formattedData = $formattedData["children"];

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

                $this->baseService->addHtmlContent("stylesheets", $themeCssFile);
            }

            //
            // Default select2 initialializer
            $view->vars["select2"] = json_encode($selectOpts);
            $view->vars["select2-sortable"] = $options["sortable"];

            // Import select2
            $this->baseService->addHtmlContent("javascripts", $options["select2-js"]);
            $this->baseService->addHtmlContent("stylesheets", $options["select2-css"]);
            $this->baseService->addHtmlContent("javascripts:body", "bundles/base/form-type-select2.js");
        }
    }

    public static function getFormattedValues($entry, $class = null, TranslatorInterface $translator = null, $format = FORMAT_SENTENCECASE) 
    {
        if($entry == null) return null;
        if(is_object($entry) && $class !== null) {

            $accessor = PropertyAccess::createPropertyAccessor();
            $id = $accessor->isReadable($entry, "id") ? strval($accessor->getValue($entry, "id")) : null;

            $autocomplete     = null;
            $autocompleteData = [];
            if(class_implements_interface($entry, AutocompleteInterface::class)) {
                $autocomplete = $entry->__autocomplete() ?? null;
                $autocompleteData = $entry->__autocompleteData() ?? []; 
            }

            $className = get_class($entry);
            if($translator) $className = $translator->entity($className, Translator::TRANSLATION_SINGULAR);

            $html = is_html($autocomplete) ? $autocomplete : null;
            $text = is_html($autocomplete) ? null          : $autocomplete;
            $data = $autocompleteData;

            if(!$text)
                $text = is_stringeable($entry) ? strval($entry) : $className . " #".$entry->getId();

            $icons = $entry->__iconize() ?? [];
            if(empty($icons) && class_implements_interface($entry, IconizeInterface::class)) 
                $icons = $entry::__staticIconize();

            $icon = begin($icons);

        } else if(class_implements_interface($class, SelectInterface::class)) {

            $id    = $entry;
            $icon  = $class::getIcon($entry, 0);
            $text  = $class::getText($entry, $translator);
            $html  = $class::getHtml($entry);
            $data  = $class::getData($entry);

        } else {

            $id    = is_array($entry) ? $entry[0] : $entry;
            $icon  = null;
            $text  = is_array($entry) ? $entry[1] : $entry;
            $html  = null;
            $data  = [];
        }

        return
        [
            "id"   => $id ?? null,
            "icon" => $icon,
            "text" => castcase($text, $format),
            "html" => $html,
            "data" => $data
        ];
    }
}
