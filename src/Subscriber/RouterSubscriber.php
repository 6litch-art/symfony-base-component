<?php

namespace Base\Subscriber;

use Base\Service\ParameterBagInterface;
use Base\Service\SettingBagInterface;
use Payum\Core\Exception\LogicException;
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

    /**
     * @var AuthorizationChecker
     */
    protected $authorizationChecker;

    /**
     * @var ParameterBag
     */
    protected $parameterBag;

    /**
     * @var SettingBag
     */
    protected $settingBag;

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
        return;

        if (!$event->isMainRequest()) {
            return ;
        }

        $route = $this->router->getRoute();
        if(!$route) return;

        $ipRestriction = !$this->parameterBag->get("base.router.ip_access")        &&  $this->authorizationChecker->isGranted("VALIDATE_IP", $route);
        if ($ipRestriction) {

            $ipFallback = array_key_exists("ip", parse_url2($this->router->getHostFallback()));
            if (!$this->parameterBag->get("base.router.ip_access") && $ipFallback)
                throw new \LogicException("IP access is disallowed and your fallback is an IP address. Either change your fallback `HTTP_DOMAIN` or turn on `base.router.ip_access`");

            $parsedUrl["host"] = $this->router->getHostFallback();
            $parsedUrl["port"] = $this->router->getPortFallback();

            $url = compose_url(
                $parsedUrl["scheme"]  ?? null,
                null,
                null,
                null,
                null,
                $parsedUrl["host"] ?? null,
                $parsedUrl["port"] ?? null,
                $parsedUrl["path"]    ?? null,
                $parsedUrl["query"]     ?? null
            );

            // Redirect to sanitized url
            $formattedUrl = $this->router->format($url);
            if($formattedUrl != get_url()) {
                exit(1);
                $event->setResponse(new RedirectResponse($formattedUrl));
            }
            return $event->stopPropagation();
        }
    }
}
