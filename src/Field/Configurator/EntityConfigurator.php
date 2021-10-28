<?php

namespace Base\Field\Configurator;

use Base\Field\EntityField;
use Doctrine\ORM\PersistentCollection;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldConfiguratorInterface;
use EasyCorp\Bundle\EasyAdminBundle\Dto\EntityDto;
use EasyCorp\Bundle\EasyAdminBundle\Dto\FieldDto;
use Symfony\Component\Form\Extension\Core\Type\CountryType;
use Symfony\Component\Form\Extension\Core\Type\CurrencyType;
use Symfony\Component\Form\Extension\Core\Type\LanguageType;
use Symfony\Component\Form\Extension\Core\Type\LocaleType;
use Symfony\Component\Form\Extension\Core\Type\TimezoneType;
use function Symfony\Component\String\u;

final class EntityConfigurator implements FieldConfiguratorInterface
{
    public function supports(FieldDto $field, EntityDto $entityDto): bool
    {
        return EntityField::class === $field->getFieldFqcn();
    }

    public function configure(FieldDto $field, EntityDto $entityDto, AdminContext $context): void
    {
        if (null !== $entryTypeFqcn = $field->getCustomOptions()->get(EntityField::OPTION_ENTRY_TYPE)) {
            $field->setFormTypeOption('entry_type', $entryTypeFqcn);
        }

        $autocompletableFormTypes = [CountryType::class, CurrencyType::class, LanguageType::class, LocaleType::class, TimezoneType::class];
        if (\in_array($entryTypeFqcn, $autocompletableFormTypes, true)) {
            $field->setFormTypeOption('entry_options.attr.data-ea-widget', 'ea-autocomplete');
        }

        $field->setFormTypeOptionIfNotSet('allow_add', $field->getCustomOptions()->get(EntityField::OPTION_ALLOW_ADD));
        $field->setFormTypeOptionIfNotSet('allow_delete', $field->getCustomOptions()->get(EntityField::OPTION_ALLOW_DELETE));
        $field->setFormTypeOptionIfNotSet('by_reference', false);
        $field->setFormTypeOptionIfNotSet('delete_empty', true);

        // TODO: check why this label (hidden by default) is not working properly
        // (generated values are always the same for all elements)
        $field->setFormTypeOptionIfNotSet('entry_options.label', $field->getCustomOptions()->get(EntityField::OPTION_SHOW_ENTRY_LABEL));

        // collection items range from a simple <input text> to a complex multi-field form
        // the 'entryIsComplex' setting tells if the collection item is so complex that needs a special
        // rendering not applied to simple collection items
        if (null === $field->getCustomOption(EntityField::OPTION_ENTRY_IS_COMPLEX)) {
            $definesEntryType = null !== $entryTypeFqcn = $field->getCustomOption(EntityField::OPTION_ENTRY_TYPE);
            $isSymfonyCoreFormType = null !== u($entryTypeFqcn ?? '')->indexOf('Symfony\Component\Form\Extension\Core\Type');
            $isComplexEntry = $definesEntryType && !$isSymfonyCoreFormType;

            $field->setCustomOption(EntityField::OPTION_ENTRY_IS_COMPLEX, $isComplexEntry);
        }

        $field->setFormattedValue($this->formatCollection($field, $context));
    }

    private function formatCollection(FieldDto $field, AdminContext $context)
    {
        $doctrineMetadata = $field->getDoctrineMetadata();
        if ($field->getCustomOption(EntityField::OPTION_RENDER_FORMAT) == "count" || 
           ('array' !== $doctrineMetadata->get('type') && !$field->getValue() instanceof PersistentCollection)) {
            return $this->countNumElements($field->getValue());
        }

        $collectionItemsAsText = [];
        foreach ($field->getValue() ?? [] as $item) {
            if (!\is_string($item) && !(\is_object($item) && method_exists($item, '__toString'))) {
                return $this->countNumElements($field->getValue());
            }

            $collectionItemsAsText[] = (string) $item;
        }

        $isDetailAction = Action::DETAIL === $context->getCrud()->getCurrentAction();

        return u(', ')->join($collectionItemsAsText)->truncate($isDetailAction ? 512 : 32, '…')->toString();
    }

    private function countNumElements($collection): int
    {
        if (null === $collection) {
            return 0;
        }

        if (is_countable($collection)) {
            return \count($collection);
        }

        if ($collection instanceof \Traversable) {
            return iterator_count($collection);
        }

        return 0;
    }
}
