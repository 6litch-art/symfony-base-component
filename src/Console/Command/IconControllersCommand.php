<?php

namespace Base\Console\Command;

use Base\Annotations\Annotation\Iconize;
use Base\Annotations\AnnotationReader;
use Base\Console\Command;
use Base\Service\Model\IconizeInterface;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Console\Attribute\AsCommand;

#[AsCommand(name:'icon:controllers', aliases:[], description:'')]
class IconControllersCommand extends Command
{
    protected function configure(): void
    {
        $this->addOption('controller', null, InputOption::VALUE_OPTIONAL, 'Should I consider only a specific controller ?');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $controllers = array_transforms(fn ($k, $v): ?array => str_starts_with($v->getDefault("_controller"), "App") ? [$k, $v->getDefault("_controller")] : null, $this->router->getRouteCollection()->all());
        $controllerRestriction = $input->getOption('controller') ?? "";

        if ($controllers) {
            $output->section()->writeln("Controller list: ".$controllerRestriction);
        }
        foreach ($controllers as $controller) {
            if (!str_starts_with($controller, $controllerRestriction)) {
                continue;
            }

            list($class, $method) = explode("::", $controller);

            $instance = AnnotationReader::getInstance();

            $annotations = $instance->getAnnotations($class, [Iconize::class]) ?? null;
            $icon = $annotations[AnnotationReader::TARGET_METHOD][$class][$method] ?? null;
            $icon = $icon ? end($icon)->getIcon() : null;

            if (!$icon) {
                $icon = $annotations[AnnotationReader::TARGET_CLASS][$class] ?? null;
                $icon = $icon ? end($icon)->getIcon() : null;
            }

            $icon = $icon ?? null;
            $iconize = $icon ? "<warning>(implements ".IconizeInterface::class.")</warning>: \"$icon\"" : "<red>(no icon found)</red>";
            $output->section()->writeln(" * <info>".trim($controller)."</info> ".$iconize);
        }


        return Command::SUCCESS;
    }
}
