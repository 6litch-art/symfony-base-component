<?php

namespace Base\Subscriber;

use App\Entity\User;
use Base\Service\BaseService;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Twig\Environment;

class LocaleSubscriber implements EventSubscriberInterface
{
    public function __construct(BaseService $baseService)
    {
        $this->default_locale =
            $baseService->getParameterBag("kernel.default_locale");
    }
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::REQUEST => ['onKernelRequest']
        ];
    }

    public function onKernelRequest(RequestEvent $event)
    {
        $request = $event->getRequest();
        $request->setLocale(User::getLocale());
    }
}
