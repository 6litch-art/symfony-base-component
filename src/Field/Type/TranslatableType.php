<?php

namespace Base\Field\Type;

use Base\Database\Factory\ClassMetadataManipulator;
use Base\Database\TranslatableInterface;
use Base\Exception\MissingLocaleException;
use Base\Field\Traits\SelectTypeInterface;
use Base\Field\Traits\SelectTypeTrait;
use Base\Service\BaseService;
use Base\Service\LocaleProviderInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Contracts\Translation\TranslatorInterface;

class TranslatableType extends AbstractType
{
    protected $defaultLocale = null;
    protected $fallbackLocales = [];
    public function __construct(ClassMetadataManipulator $classMetadataManipulator, LocaleProviderInterface $localeProvider)
    {
        $this->classMetadataManipulator = $classMetadataManipulator;
        $this->localeProvider = $localeProvider;
    }

    public function getFields(FormInterface $form, array $options): array
    {
        $translatableClass = $this->getTranslationDataClass($form);
        $rawFields = $this->classMetadataManipulator->getFields($translatableClass, $options["fields"], $options["excluded_fields"]);

        foreach ($rawFields as $fieldName => $fieldConfig) {

            // Simplest case: General options for all locales
            if (!isset($fieldConfig['locale_options'])) {
                foreach ($options['available_locales'] as $locale) {
                    $fields[$locale][$fieldName] = $fieldConfig;
                }

                continue;
            }

            // Custom options by locale
            $localesFieldOptions = $fieldConfig['locale_options'];
            unset($fieldConfig['locale_options']);

            foreach ($options['available_locales'] as $locale) {
                $localeFieldOptions = $localesFieldOptions[$locale] ?? [];
                if (!isset($localeFieldOptions['display']) || (true === $localeFieldOptions['display'])) {
                    $fields[$locale][$fieldName] = $localeFieldOptions + $fieldConfig;
                }
            }
        }

        return $fields;
    }

    private function getTranslationDataClass(FormInterface $form): string
    {
        $translatableClass = $form->getConfig()->getDataClass();
        $translatableClass = is_subclass_of($form->getConfig()->getDataClass(), TranslatableInterface::class) ? $form->getConfig()->getDataClass() : null;

        while($translatableClass === null) {

            $translatableClass = $form->getParent()->getConfig()->getDataClass();
            $form = $form->getParent();
        };

        if(!$translatableClass)
            throw new \Exception("Missing \"data_class\" option in FormType \"".$form->getName()."\" (".get_class($form->getConfig()->getType()->getInnerType()).")");

        if(!is_subclass_of($translatableClass, TranslatableInterface::class))
            throw new \Exception("Translatable interface not implemented in \"".$translatableClass."\"");

        return $translatableClass::getTranslationEntityClass();
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) {
            
            $form = $event->getForm();

            if (null === $formParent = $form->getParent()) {
                throw new \RuntimeException('Parent form missing');
            }

            $options = $form->getConfig()->getOptions();
            $fields = $this->getFields($form, $options);

            $translationClass = $this->getTranslationDataClass($form);

            foreach ($options['available_locales'] as $locale) {

                if (!isset($fields[$locale])) {
                    continue;
                }

                $form->add($locale, EntityType::class, [
                    'data_class' => $translationClass,
                    'required' => \in_array($locale, $options['required_locales'], true),
                    'fields' => $fields[$locale],
                    'excluded_fields' => $options['excluded_fields']
                ]);
            }
        });

        $builder->addEventListener(FormEvents::SUBMIT, function (FormEvent $event) {

            $data = $event->getData();
            foreach ($data as $locale => $translation) {

                if ($translation === null)
                    $data->removeElement($translation);
                else if ($translation->isEmpty())
                    $data->removeElement($translation);
                else 
                    $translation->setLocale($locale);
            }

            $event->setData($data);
        });
    }

    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        $view->vars["locale"]           = $options["locale"];
        $view->vars["defaultLocale"]    = $options["default_locale"];
        $view->vars["availableLocales"] = $options["available_locales"];
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'label' => false,
            
            'locale'            => $this->localeProvider->getLocale(),
            'locale_options'    => [],
            'default_locale'    => $this->localeProvider->getDefaultLocale(),
            'required_locales'  =>  [],
            'available_locales' => $this->localeProvider->getAvailableLocales(),

            'by_reference' => false,
            'empty_data' => fn(FormInterface $form) => new ArrayCollection,
            
            'fields' => [],
            'excluded_fields' => [],
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'translatable';
    }
}