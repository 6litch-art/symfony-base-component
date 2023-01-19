<?php

namespace Base\Subscriber;

use App\Entity\User;
use Base\Entity\User as BaseUser;
use App\Entity\User\Notification;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;

class TimezoneSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => ['onKernelRequest']
        ];
    }

    public function onKernelRequest(RequestEvent $event)
    {
        if(!is_instanceof(User::class, BaseUser::class)) return;

        $timezone = User::getCookie("timezone") ?? "UTC";
        $defaultTimezone = date_default_timezone_get();

        if($timezone != $defaultTimezone) {
            $notification = new Notification("invalidTimezone", [$timezone]);
            $notification->send("info");
        }
    }
}
