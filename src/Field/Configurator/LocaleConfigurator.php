<?php

namespace Base\Field\Configurator;

use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldConfiguratorInterface;
use EasyCorp\Bundle\EasyAdminBundle\Dto\EntityDto;
use EasyCorp\Bundle\EasyAdminBundle\Dto\FieldDto;
use EasyCorp\Bundle\EasyAdminBundle\Field\LocaleField;
use InvalidArgumentException;
use Symfony\Component\Intl\Exception\MissingResourceException;
use Symfony\Component\Intl\Locales;
use function in_array;

/**
 * @author Javier Eguiluz <javier.eguiluz@gmail.com>
 */
class LocaleConfigurator implements FieldConfiguratorInterface
{
    public function supports(FieldDto $field, EntityDto $entityDto): bool
    {
        return LocaleField::class === $field->getFieldFqcn();
    }

    public function configure(FieldDto $field, EntityDto $entityDto, AdminContext $context): void
    {
        $field->setFormTypeOptionIfNotSet('attr.data-ea-widget', 'ea-autocomplete');

        if (in_array($context->getCrud()->getCurrentPage(), [Crud::PAGE_EDIT, Crud::PAGE_NEW], true)) {
            $field->setFormTypeOption('choices', $this->generateFormTypeChoices($field->getCustomOption(LocaleField::OPTION_LOCALE_CODES_TO_KEEP), $field->getCustomOption(LocaleField::OPTION_LOCALE_CODES_TO_REMOVE)));
            $field->setFormTypeOption('choice_loader', null);
        }

        if (null === $localeCode = $field->getValue()) {
            return;
        }

        $localeName = $this->getLocaleName(str_replace("-", "_", $localeCode));
        if (null === $localeName) {
            throw new InvalidArgumentException(sprintf('The "%s" value used as the locale code of the "%s" field is not a valid ICU locale code.', $localeCode, $field->getProperty()));
        }

        $field->setFormattedValue($localeName);
    }

    protected function getLocaleName(string $localeCode): ?string
    {
        try {
            return Locales::getName($localeCode);
        } catch (MissingResourceException) {
            return null;
        }
    }

    protected function generateFormTypeChoices(?array $localeCodesToKeep, ?array $localeCodesToRemove): array
    {
        $choices = [];

        $locales = Locales::getNames();
        foreach ($locales as $localeCode => $localeName) {
            if (null !== $localeCodesToKeep && !in_array($localeCode, $localeCodesToKeep, true)) {
                continue;
            }

            if (null !== $localeCodesToRemove && in_array($localeCode, $localeCodesToRemove, true)) {
                continue;
            }

            $choices[$localeName] = $localeCode;
        }

        return $choices;
    }
}
