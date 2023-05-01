<?php

namespace Base\Console;

use Base\Service\BaseService;
use Base\Service\LocalizerInterface;
use Base\Service\ParameterBagInterface;
use Base\Service\TranslatorInterface;
use Doctrine\ORM\EntityManagerInterface;
use LogicException;
use Symfony\Component\Console\Command\Command as SymfonyCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Formatter\OutputFormatterStyle;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\PropertyAccess\PropertyAccess;
use Symfony\Component\Console\Output\ConsoleOutputInterface;
use Symfony\Component\PropertyAccess\PropertyAccessor;

class Command extends SymfonyCommand
{
    /**
     * @var LocalizerInterface
     */
    protected LocalizerInterface $localizer;
    /**
     * @var TranslatorInterface
     */
    protected TranslatorInterface $translator;
    /**
     * @var EntityManagerInterface
     */
    protected $entityManager;
    /**
     * @var ParameterBagInterface
     */
    protected ParameterBagInterface $parameterBag;
    /**
     * @var PropertyAccessor
     */
    protected PropertyAccessor $propertyAccessor;

    public function __construct(LocalizerInterface $localizer, TranslatorInterface $translator, EntityManagerInterface $entityManager, ParameterBagInterface $parameterBag)
    {
        $this->localizer = $localizer;
        $this->translator = $translator;
        $this->entityManager = $entityManager;
        $this->parameterBag = $parameterBag;

        $this->propertyAccessor = PropertyAccess::createPropertyAccessor();
        parent::__construct();
    }

    protected function getTranslator(): TranslatorInterface
    {
        return $this->translator;
    }

    protected function getParameterBag(): ParameterBagInterface
    {
        return $this->parameterBag;
    }

    protected function getEntityManager(): EntityManagerInterface
    {
        return $this->entityManager;
    }

    protected function getLocalizer(): LocalizerInterface
    {
        return $this->localizer;
    }

    protected function configure(): void
    {
        $this->addOption('purpose', null, InputOption::VALUE_OPTIONAL, 'Show command description ?');
    }

    public function run(InputInterface $input, OutputInterface $output): int
    {
        if (!$output instanceof ConsoleOutputInterface) {
            throw new LogicException('This command accepts only an instance of "ConsoleOutputInterface".');
        }

        $output->getFormatter()->setStyle('info', new OutputFormatterStyle('green', null, []));
        $output->getFormatter()->setStyle('bold,info', new OutputFormatterStyle('green', null, ['bold']));
        $output->getFormatter()->setStyle('info,bold', new OutputFormatterStyle('green', null, ['bold']));
        $output->getFormatter()->setStyle('info,bkg', new OutputFormatterStyle('black', 'green'));
        $output->getFormatter()->setStyle('bkg,info', new OutputFormatterStyle('black', 'green'));

        $output->getFormatter()->setStyle('warning', new OutputFormatterStyle('yellow', null, []));
        $output->getFormatter()->setStyle('warning,bold', new OutputFormatterStyle('yellow', null, ['bold']));
        $output->getFormatter()->setStyle('bold,warning', new OutputFormatterStyle('yellow', null, ['bold']));
        $output->getFormatter()->setStyle('warning,bkg', new OutputFormatterStyle('black', 'yellow'));
        $output->getFormatter()->setStyle('bkg,warning', new OutputFormatterStyle('black', 'yellow'));

        $output->getFormatter()->setStyle('red', new OutputFormatterStyle('red', null, []));
        $output->getFormatter()->setStyle('red,bold', new OutputFormatterStyle('red', null, ['bold']));
        $output->getFormatter()->setStyle('bold,red', new OutputFormatterStyle('red', null, ['bold']));
        $output->getFormatter()->setStyle('red,bkg', new OutputFormatterStyle(null, 'red'));
        $output->getFormatter()->setStyle('bkg,red', new OutputFormatterStyle(null, 'red'));

        $output->getFormatter()->setStyle('ln', new OutputFormatterStyle('cyan', null, []));
        $output->getFormatter()->setStyle('ln,bold', new OutputFormatterStyle('cyan', null, ['bold']));
        $output->getFormatter()->setStyle('bold,ln', new OutputFormatterStyle('cyan', null, ['bold']));
        $output->getFormatter()->setStyle('ln,bkg', new OutputFormatterStyle(null, 'cyan'));
        $output->getFormatter()->setStyle('bkg,ln', new OutputFormatterStyle(null, 'cyan'));

        $output->getFormatter()->setStyle('magenta', new OutputFormatterStyle('magenta', null, []));
        $output->getFormatter()->setStyle('magenta,bold', new OutputFormatterStyle('magenta', null, ['bold']));
        $output->getFormatter()->setStyle('bold,magenta', new OutputFormatterStyle('magenta', null, ['bold']));
        $output->getFormatter()->setStyle('magenta,bkg', new OutputFormatterStyle(null, 'magenta'));
        $output->getFormatter()->setStyle('bkg,magenta', new OutputFormatterStyle(null, 'magenta'));

        $defaultDescription = get_called_class()::$defaultDescription;
        if ($defaultDescription && $input->hasArgument("purpose")) {
            $output->section()->writeln("\n // Command purpose :");
            foreach (explode("\n", $defaultDescription) as $line) {
                $output->section()->writeln(" // \t" . trim($line));
            }

            $output->section()->writeln(" // \n");
        }

        return parent::run($input, $output);
    }
}
