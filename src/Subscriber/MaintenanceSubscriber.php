<?php

namespace Base\Subscriber;
use Base\Service\BaseService;
use Base\Entity\User\Notification;

use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpFoundation\RedirectResponse;

class MaintenanceSubscriber implements EventSubscriberInterface
{
    /**
    * @var BaseService
    */
    private $baseService;

    /**
    * @var string
    */
    private $lockPath;

    /**
    * @var string
    */
    private $forceRedirect;

    public function __construct(BaseService $baseService)
    {
    	$this->baseService = $baseService;
        $this->baseService->redirect = $baseService->getParameterBag("base.maintenance");
        $this->lockPath = $baseService->getParameterBag("base.maintenance_lockpath");
    }

    public static function getSubscribedEvents()
    {
        return [ RequestEvent::class => [['onRequestEvent']] ];
    }

    public function onRequestEvent(RequestEvent $event)
    {
        // Exception triggered
        if( empty($this->getCurrentRoute($event)) )
            return;

        // Avoid symfony profiler ajax request to go through this..
        if (preg_match('/^\/(_(wdt|profiler))/', $event->getRequest()->getRequestUri()))
            return;

        // Check if lock file is found or not..
        if(!$this->baseService->isMaintenance()) {

            if(preg_match('/^base_maintenance/', $this->getCurrentRoute($event)))
                $this->baseService->redirectToRoute($event, "base_homepage");

            return;
        }

        if(($user = $this->baseService->getUser()) && $this->baseService->isGranted("ROLE_SUPERADMIN")) {
            $username = $user->getUsername();
            $notification = new Notification("Maintenance", "This website is currently <b>under maintenance</b>. (Only super administrators can see this page!)");
            $notification->send("danger");
            return;
        }

        // Disconnect user
        $this->baseService->Logout();

        // Apply redirection to maintenance page
       if(!preg_match('/^base_(maintenance|login)/', $this->getCurrentRoute($event)))
            $this->baseService->redirectToRoute($event, "base_maintenance");

        // Stopping page execution
        $event->stopPropagation();
    }

    public function getCurrentRoute($event) { return $event->getRequest()->get('_route'); }

    public function allowRedirect() { return $this->baseService->redirect; }
}
