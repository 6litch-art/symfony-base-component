<?php

namespace Base\Subscriber;

use Base\Service\HotParameterBag;
use Base\Service\ParameterBagInterface;
use Base\Service\SettingBagInterface;
use PDOException;
use Symfony\Component\Console\ConsoleEvents;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 *
 */
class HotParameterBagSubscriber implements EventSubscriberInterface
{
    /**
     * @var ParameterBagInterface
     */
    protected ParameterBagInterface $parameterBag;
    /**
     * @var SettingBagInterface
     */
    protected SettingBagInterface $settingBag;

    /**
     * @param $parameterBag
     * @param SettingBagInterface $settingBag
     */
    public function __construct($parameterBag, SettingBagInterface $settingBag)
    {
        $this->parameterBag = $parameterBag;
        $this->settingBag = $settingBag;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            ConsoleEvents::COMMAND => ['onRequest', 2048],
            KernelEvents::REQUEST => ['onRequest', 512]
        ];
    }

    /**
     * @param $event
     * @return void
     */
    public function onRequest($event)
    {
        if ($event instanceof RequestEvent && !$event->isMainRequest()) {
            return;
        }
        if (!$this->parameterBag instanceof HotParameterBag) {
            return;
        }
        if ($this->parameterBag->isReady()) {
            return;
        }

        $allRaw = [];
        try {
            $allRaw = $this->settingBag->allRaw(true, true);
        } catch (PDOException $e) {
            return;
        }

        array_map_recursive(function ($setting) {
            if ($setting === null) {
                return;
            }
            if ($setting->getBag() === null) {
                return;
            }

            $this->parameterBag->add([$setting->getBag() => $setting->getValue()]);
        }, $allRaw);

        $this->parameterBag->markAsReady();
    }
}
