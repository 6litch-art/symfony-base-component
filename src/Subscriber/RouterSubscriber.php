<?php

namespace Base\Subscriber;

use Base\Service\ParameterBagInterface;
use Base\Service\SettingBagInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationChecker;

class RouterSubscriber implements EventSubscriberInterface
{
    /**
     * @var Router
     */
    protected $router;

    public function __construct(AuthorizationChecker $authorizationChecker, RouterInterface $router, ParameterBagInterface $parameterBag, SettingBagInterface $settingBag)
    {
        $this->authorizationChecker = $authorizationChecker;
        $this->router = $router;
        $this->parameterBag = $parameterBag;
        $this->settingBag = $settingBag;
    }

    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::REQUEST  => ['onKernelRequest', 7]];
    }

    public function onKernelRequest(RequestEvent $event)
    {
        if(!$event->isMainRequest()) return ;
        $route = $this->router->getRoute();

        //
        // Redirect IP if restriction enabled
        if($route && !$this->authorizationChecker->isGranted("VALIDATE_IP", $route)) {

            $event->setResponse(new RedirectResponse(get_url(null, $this->router->getHost())));
            return $event->stopPropagation();
        }

        //
        // If no host specified in Route, then check the list of permitted subdomain
        if($route && !$this->authorizationChecker->isGranted("VALIDATE_HOST", $route)) {

            $event->setResponse(new RedirectResponse($this->router->format(get_url())));
            return $event->stopPropagation();
        }

        //
        // If no host specified in Route, then check the list of permitted subdomain
        if($route && !$this->authorizationChecker->isGranted("VALIDATE_PATH", $route)) {

            $event->setResponse(new RedirectResponse(sanitize_url(get_url())));
            return $event->stopPropagation();
        }
    }
}
