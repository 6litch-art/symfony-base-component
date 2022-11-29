<?php

namespace Base\Subscriber;

use App\Enum\UserRole;
use Base\Routing\RouterInterface;
use Base\Service\ParameterBag;
use Base\Twig\Environment;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class TwigSubscriber implements EventSubscriberInterface
{
    public function __construct(Environment $twig, AuthorizationCheckerInterface $authorizationChecker, ParameterBag $parameterBag, RouterInterface $router, string $publicDir)
    {
        $this->twig                 = $twig;
        $this->parameterBag         = $parameterBag;
        $this->router               = $router;
        $this->authorizationChecker = $authorizationChecker;

        $this->publicDir            = $publicDir;
        $this->autoAppend           = $this->parameterBag->get("base.twig.autoappend");
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => ['onKernelRequest', 8],
            KernelEvents::RESPONSE => ['onKernelResponse'],
            KernelEvents::EXCEPTION => ['onKernelException'],
        ];
    }

    private function allowRender(ResponseEvent $event)
    {
        if (!$this->autoAppend)
            return false;

        $contentType = $event->getResponse()->headers->get('content-type');
        if ($contentType && !str_contains($contentType, "text/html"))
            return false;

        if ($this->router->isProfiler())
            return false;

        if($this->exceptionTriggered)
            return false;

        if (!$event->isMainRequest())
            return false;

        return true;
    }

    protected $exceptionTriggered = false;
    public function onKernelException(RequestEvent $event)
    {
        $this->exceptionTriggered = true;
    }

    public function onKernelRequest(RequestEvent $event)
    {
        // @TODO.. use cache warmer
        $this->twig->addEncoreEntrypoint( "_base", $this->publicDir."/bundles/base/entrypoints.json");
        $this->twig->addEncoreTag("base", "_base");
        $this->twig->addEncoreTag("form", "_base");

        foreach(UserRole::getPermittedValues() as $role) {

            $tag = "security_".snake2camel(strtolower(str_lstrip($role, "ROLE_")));
            if(!$this->twig->hasEncoreEntry($tag)) continue;

            if ($this->authorizationChecker->isGranted($role))
                $this->twig->addEncoreTag($tag);
        }
    }

    public function onKernelResponse(ResponseEvent $event)
    {
        if ($this->allowRender($event)) {

            $response = $event->getResponse();
            $content = $response->getContent();

            $noscripts   = $this->twig->getHtmlContent("noscripts");
            $content = preg_replace('/<body\b[^>]*>/', "$0".$noscripts, $content, 1);

            $stylesheetsHead = $this->twig->getHtmlContent("stylesheets:before");
            $content = preg_replace('/(head\b[^>]*>)(.*?)(<link|<style)/s', "$1$2".$stylesheetsHead."$3", $content, 1);
            $stylesheets = $this->twig->getHtmlContent("stylesheets");
            $content = preg_replace('/<\/head\b[^>]*>/', $stylesheets."$0", $content, 1);
            $stylesheets = $this->twig->getHtmlContent("stylesheets:after");
            $content = preg_replace('/<\/head\b[^>]*>/', $stylesheets."$0", $content, 1);

            $javascriptsHead = $this->twig->getHtmlContent("javascripts:head");
            $content = preg_replace('/(head\b[^>]*>)(.*?)(<script)/s', "$1$2".$javascriptsHead."$3", $content, 1);
            $javascripts = $this->twig->getHtmlContent("javascripts");
            $content = preg_replace('/<\/head\b[^>]*>/', $javascripts."$0", $content, 1);
            $javascriptsBody = $this->twig->getHtmlContent("javascripts:body");
            $content = preg_replace('/<\/body\b[^>]*>/', "$0".$javascriptsBody, $content, 1);

            if(!is_instanceof($response, [StreamedResponse::class, BinaryFileResponse::class]))
                $response->setContent($content);

            return true;
        }

        return false;
    }
}
