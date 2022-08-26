<?php

namespace Base\Console\Command;

use Base\BaseBundle;
use Base\Console\Command;
use Base\Database\NamingStrategy;
use Base\Service\LocaleProvider;
use Base\Service\Translator;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Attribute\AsCommand;

#[AsCommand(name:'translation:entities', aliases:[], description:'')]
class TranslationEntitiesCommand extends Command
{
    protected function configure(): void
    {
        $this->addOption('entity', null, InputOption::VALUE_OPTIONAL, 'Should I consider only a specific entity ?');
        $this->addOption('suffix', null, InputOption::VALUE_OPTIONAL, 'Should I add a specific translation suffix to the default path ?', Translator::NOUN_SINGULAR);
        $this->addOption('locale', null, InputOption::VALUE_OPTIONAL, 'Should I display only a specific locale ?');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $baseLocation = dirname((new \ReflectionClass('Base\\BaseBundle'))->getFileName());
        $entityRestriction = $input->getOption('entity') ?? "";
        $entities = array_merge(
            BaseBundle::getAllNamespacesAndClasses("./src/Entity"),
            BaseBundle::getAllNamespacesAndClasses($baseLocation."/Entity"),
        );
        $namespaces = array_merge(
            BaseBundle::getAllNamespaces("./src/Entity"),
            BaseBundle::getAllNamespaces($baseLocation."/Entity"),
        );

        $maxLength = [];
        if(!$entityRestriction) {
            foreach($entities as $entity) {
                if(in_array($entity, ["App\Entity","Base\Entity"])) continue;
                if(str_ends_with($entity, NamingStrategy::TABLE_I18N_SUFFIX)) continue;

                $maxLength[class_namespace($entity)] = max(strlen($entity), $maxLength[class_namespace($entity)] ?? 0);
            }
        }

        $locale = $input->getOption('locale');
        $locale = $locale ? $this->localeProvider->getLocale($locale) : null;
        $availableLocales = LocaleProvider::getAvailableLocales();
        if($locale && !in_array($locale, $availableLocales))
            throw new \Exception("Locale not found in the list of available locale: [".implode(",", $availableLocales)."]");

        $suffix = $input->getOption('suffix');
        if($entities) $output->section()->writeln("Entity list: ".$entityRestriction);
        foreach($entities as $entity) {

            if($entity == "App\Entity") continue;
            if($entity == "Base\Entity") continue;
            if(str_ends_with($entity, NamingStrategy::TABLE_I18N_SUFFIX)) continue;
            if(!str_starts_with($entity, $entityRestriction)) continue;

            $isClass = class_exists($entity) ? " <info>& class</info>" : "";
            $entityStr = $entity . (in_array($entity, $namespaces) ? " (namespace".$isClass.")" : null);
            $color = in_array($entity, $namespaces) ? "magenta" : "info";

            $trans = "";
            foreach($availableLocales as $currentLocale) {

                if($locale !== null && $locale != $currentLocale) continue;
                $prefix = "\n\t - ";
                $space = "";

                $path = explode("\\", $entity);
                $path = implode(".", tail($path, 2));
                $translationPath = "@entities.".camel2snake($path, ".").".".$suffix;
                $translationPathStr = $prefix."@entities[$currentLocale].<ln>".camel2snake($path, ".").".".$suffix."</ln>";
                $translation = $this->translator->trans($translationPath, [], null, $currentLocale);

                if($translation == $translationPath) $trans .= "<warning>".$translationPathStr."</warning><red> = \"no translation found\"</red>";
                else $trans .= "<warning>".$translationPathStr." </warning>= \"". $translation."\"";
            }

            $output->section()->writeln(" * <".$color.">".trim($entityStr)."</".$color."> ".$space.": $trans");
        }


        return Command::SUCCESS;
    }
}
