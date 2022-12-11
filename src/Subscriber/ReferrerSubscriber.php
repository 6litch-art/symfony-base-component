<?php

namespace Base\Subscriber;

use Base\Service\ReferrerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

use Base\Routing\RouterInterface;

use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\Security\Http\Event\LogoutEvent;
use Symfony\Component\Security\Http\Event\LoginFailureEvent;
use Symfony\Component\Security\Http\Event\LoginSuccessEvent;

use Base\Service\ParameterBagInterface;

class ReferrerSubscriber implements EventSubscriberInterface
{
    /**
     * @var RouterInterface
     */
    private $router;

    public function __construct(
        ReferrerInterface $referrer,
        RouterInterface $router,
        ParameterBagInterface $parameterBag) {

        $this->router = $router;
        $this->parameterBag = $parameterBag;
        $this->referrer = $referrer;
    }

    public static function getSubscribedEvents(): array
    {
        return [RequestEvent::class    => [['onKernelRequest', 4]]];
    }

    public function getCurrentRouteName($event) { return $event->getRequest()->get('_route'); }

    public function isException($route)
    {
        $exceptions = $this->parameterBag->get("base.access_restrictions.route_exceptions") ?? [];
        foreach($exceptions as $pattern)
            if (preg_match($pattern, $route)) return true;

        return false;
    }

    public function onKernelRequest(RequestEvent $event)
    {
        if(!$event->isMainRequest()) return;
        if($this->router->isProfiler()) return;

        $referrerPath = strval($this->referrer);
        $referrerRoute = $this->router->getRouteName($referrerPath);
        if($this->isException($referrerRoute)) $this->referrer->clear();

        $currentRoute = $this->getCurrentRouteName($event);
        if(!$this->isException($currentRoute))
            $this->referrer->setUrl($event->getRequest()->getUri());
    }
}
