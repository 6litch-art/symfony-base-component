<?php

namespace Base\Command;

use Base\BaseBundle;
use Base\Component\Console\Command\Command;
use Base\Service\BaseService;
use Base\Service\LocaleProvider;
use Base\Service\LocaleProviderInterface;
use Base\Service\TranslatorInterface;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class TranslationEnumsCommand extends Command
{
    protected static $defaultName = 'translation:enums';

    public function __construct(TranslatorInterface $translator, LocaleProviderInterface $localeProvider, BaseService $baseService)
    {
        $this->translator = $translator;
        $this->localeProvider = $localeProvider;

        $this->baseService = $baseService;
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption('enum', null, InputOption::VALUE_OPTIONAL, 'Should I consider only a specific enum ?');
        $this->addOption('suffix', null, InputOption::VALUE_OPTIONAL, 'Should I add a specific translation suffix to the default path ?', "singular");
        $this->addOption('locale', null, InputOption::VALUE_OPTIONAL, 'Should I display only a specific locale ?');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $baseLocation = dirname((new \ReflectionClass('Base\\BaseBundle'))->getFileName());
        $enumRestriction = $input->getOption('enum') ?? "";
        $enums = array_merge(
            BaseBundle::getAllClasses("./src/Enum"), 
            BaseBundle::getAllClasses($baseLocation."/Enum"),
        );

        $maxLength = 0;
        if(!$enumRestriction) {
            foreach($enums as $enum)
                $maxLength = max(strlen($enum), $maxLength);
        }

        $locale = $input->getOption('locale');
        $locale = $locale ? $this->localeProvider->getLocale($locale) : null;
        $availableLocales = LocaleProvider::getAvailableLocales();
        if($locale && !in_array($locale, $availableLocales))
            throw new \Exception("Locale not found in the list of available locale: [".implode(",", $availableLocales)."]");

        $suffix = $input->getOption('suffix');
        if($enums) $output->section()->writeln("Enum list: ".$enumRestriction);
        foreach($enums as $enum) {

            if(!str_starts_with($enum, $enumRestriction)) continue;

            $trans = "";
            foreach($availableLocales as $currentLocale) {

                if($locale !== null && $locale != $currentLocale) continue;
                if($locale === null) {
                    $prefix = "\n\t - ";
                    $space = "";
                } else {
                    $prefix = "";
                    $space = str_repeat(" ", max($maxLength-strlen($enum), 0));
                }

                $path = explode("\\", $enum);
                $path = implode(".", tail($path, 2));
                $translationPath = "@enums.".camel_to_snake($path, "_").".".$suffix;
                $translationPathStr = $prefix."@enums[$currentLocale].<ln>".camel_to_snake($path, "_").".".$suffix."</ln>";
                $translation = $this->translator->trans($translationPath, [], null, $currentLocale);

                if($translation == $translationPath) $trans .= "<warning>".$translationPathStr."</warning><red> = \"no translation found\"</red>";
                else $trans .= "<warning>".$translationPathStr." </warning>= \"". $translation."\"";
            }

            $output->section()->writeln("\n * <magenta>".trim($enum)."</magenta> ".$space.": $trans");

            $maxValueLength = 0;
            foreach($enum::getPermittedValues(false) as $value)
                $maxValueLength = max(strlen($enum."::".$value), $maxValueLength);

            foreach($enum::getPermittedValues(false) as $value) {

                $value = strval($value);
                $trans2 = "";
                foreach($availableLocales as $currentLocale) {
    
                    if($locale !== null && $locale != $currentLocale) continue;
                    if($locale === null) {
                        $prefix = "\n\t\t - ";
                        $space = "";
                    } else {
                        $prefix = "";
                        $space = str_repeat(" ", max($maxValueLength-strlen($enum."::".$value), 0));
                    }
    
                    $translationPath = "@enums.".camel_to_snake($path, "_").".".strtolower($value).".".$suffix;
                    $translationPathStr = $prefix."@enums[$currentLocale].<ln>".camel_to_snake($path,"_").".".strtolower($value).".".$suffix."</ln>";
                    $translation = $this->translator->trans($translationPath, [], null, $currentLocale);
    
                    if($translation == $translationPath) $trans2 .= "<warning>".$translationPathStr."</warning><red> = \"no translation found\"</red>";
                    else $trans2 .= "<warning>".$translationPathStr." </warning>= \"". $translation."\"";
                }
                $output->section()->writeln("\t * <info>".trim($enum."::".$value)."</info> ".$space.": $trans2");
            }
        }


        return Command::SUCCESS;
    }
}