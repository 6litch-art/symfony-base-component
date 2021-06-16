<?php

namespace Base\DatabaseSubscriber;

use Symfony\Component\Console\ConsoleEvents;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Event\ConsoleCommandEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ConnectionSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents()
    {
        return [ ConsoleEvents::COMMAND => ['onConsoleCommand'] ];
    }

    public function onConsoleCommand(ConsoleCommandEvent $event)
    {
        // Add '--site' option to every command:
        $command = $event->getCommand();
        //$command->addOption('site', null, InputOption::VALUE_OPTIONAL);
    }
}
