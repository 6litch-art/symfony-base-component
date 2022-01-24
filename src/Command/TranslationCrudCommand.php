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
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController as EaCrudController;

class TranslationCrudCommand extends Command
{
    protected static $defaultName = 'translation:crud';

    public function __construct(TranslatorInterface $translator, LocaleProviderInterface $localeProvider, BaseService $baseService)
    {
        $this->translator = $translator;
        $this->localeProvider = $localeProvider;

        $this->baseService = $baseService;
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption('crud',   null, InputOption::VALUE_OPTIONAL, 'Should I consider only a specific CRUD controller ?');
        $this->addOption('action',   null, InputOption::VALUE_OPTIONAL, 'Should I consider only a specific CRUD action ?', "index");
        $this->addOption('suffix',  null, InputOption::VALUE_OPTIONAL, 'Should I add a specific translation suffix to the default path ?', "title");
        $this->addOption('locale',     null, InputOption::VALUE_OPTIONAL, 'Should I display only a specific locale ?');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $baseLocation = dirname((new \ReflectionClass('Base\\BaseBundle'))->getFileName());
        $crudRestriction = $input->getOption('crud') ?? "";
        $cruds = array_filter(
            array_merge(
                BaseBundle::getAllClasses($baseLocation."/Controller/Dashboard/Crud"),
                BaseBundle::getAllClasses("./src/Controller/Dashboard/Crud"), 
            ), fn($c) => !($c instanceof EaCrudController)
        );

        $maxLength = 0;
        if(!$crudRestriction) {
            foreach($cruds as $crud)
                $maxLength = max(strlen($crud), $maxLength);
        }

        $action = $input->getOption('action');

        $locale = $input->getOption('locale');
        $locale = $locale ? $this->localeProvider->getLocale($locale) : null;
        $availableLocales = LocaleProvider::getAvailableLocales();
        if($locale && !in_array($locale, $availableLocales))
            throw new \Exception("Locale not found in the list of available locale: [".implode(",", $availableLocales)."]");

        $suffix = $input->getOption('suffix');
        if($cruds) $output->section()->writeln("CRUD controller list: ".$crudRestriction);
        foreach($cruds as $crud) {

            if(!str_starts_with($crud, $crudRestriction)) continue;
            
            $trans = "";
            foreach($availableLocales as $currentLocale) {

                if($locale !== null && $locale != $currentLocale) continue;
                if($locale === null) {
                    $prefix = "\n\t - ";
                    $space = "";
                } else {
                    $prefix = "";
                    $space = str_repeat(" ", max($maxLength-strlen($crud), 0));
                }

                $translation = "";
                if(!$translation) {

                    $path = explode("\\", $crud);
                    $path = str_strip(implode(".", tail($path, 4)), "", "CrudController");

                    $translationPath = "@dashboard.crud.".camel_to_snake($path).".".$action.".".$suffix;
                    $translationPathStr = $prefix."@dashboard[$currentLocale].<ln>crud.".camel_to_snake($path).".".$action.".".$suffix."</ln>";
                    $translation = $this->translator->trans($translationPath, [], null, $currentLocale);

                    if($translation == $translationPath) $trans .= "<warning>".$translationPathStr."</warning><red> = \"no translation found\"</red> (possible entity fallback)";
                    else $trans .= "<warning>".$translationPathStr." </warning>= \"". $translation."\"";
                }
            }

            $output->section()->writeln(" * <info>".trim($crud)."</info> ".$space.": $trans");
        }


        return Command::SUCCESS;
    }
}
