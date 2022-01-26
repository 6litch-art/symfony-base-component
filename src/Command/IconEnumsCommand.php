<?php

namespace Base\Command;

use Base\Annotations\AnnotationReader;
use Base\BaseBundle;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

use Base\Component\Console\Command\Command;
use Base\Service\BaseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Input\InputOption;

class IconEnumsCommand extends Command
{
    protected static $defaultName = 'icon:enums';

    protected function configure(): void
    {
        $this->addOption('enum',   null, InputOption::VALUE_OPTIONAL, 'Should I consider only a specific enum ?');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $baseLocation = dirname((new \ReflectionClass('Base\\BaseBundle'))->getFileName());
        $enumRestriction = $input->getOption('enum') ?? "";
        $enums = array_merge(
            BaseBundle::getAllClasses($baseLocation."/Enum"),
            BaseBundle::getAllClasses("./src/Enum"), 
        );

        if($enums) $output->section()->writeln("Enum list: ".$enumRestriction);
        foreach($enums as $enum) {
        
            if(!str_starts_with($enum, $enumRestriction)) continue;

            $output->section()->writeln(" * <info>".$enum."</info>");

            $iconize = $enum::__iconizeStatic();
            $permittedValues = $enum::getPermittedValues(false);

            $maxLength = 0;
            foreach($permittedValues as $value)
                $maxLength = max($maxLength, strlen($value));

            foreach($permittedValues as $value) {

                $space = str_repeat(" ", max($maxLength-strlen($value), 0));
                $icons = is_array($iconize[$value]) ? $iconize[$value] : [$iconize[$value]];
                $output->section()->writeln("\t<warning>".$value."</warning> ".$space.": [".implode(",", $icons ?? [])."]");
            }
        }

        return Command::SUCCESS;
    }
}
