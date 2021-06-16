<?php

namespace Base\EntitySubscriber;

use App\Entity\User;
use App\EntityEvent\UserEvent;
use Base\Service\BaseService;

use Doctrine\ORM\Events;
use Doctrine\Common\EventSubscriber;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Exception;
use Symfony\Component\EventDispatcher\Debug\TraceableEventDispatcher;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class UserSubscriber implements EventSubscriber
{
    /**
     * @var BaseService
     */
    private $baseService;
    private $tokenStorage;

    protected array $events;
    public function __construct(BaseService $baseService, TokenStorageInterface $tokenStorage, TraceableEventDispatcher $dispatcher){

        $this->dispatcher   = $dispatcher;
        $this->baseService  = $baseService;
        $this->tokenStorage = $tokenStorage;
        $this->events       = [];
    }

    public function getSubscribedEvents()
    {
        return [
            Events::postUpdate,
            Events::preUpdate,
            Events::postPersist,
            Events::prePersist
        ];
    }

    public function prePersist(LifecycleEventArgs $event)
    {
        $user = $event->getObject();
        if (!$user instanceof User) return;

        // Update only if required
        $this->events[spl_object_id($user)][] = UserEvent::REGISTER;
    }

    public function preUpdate(LifecycleEventArgs $event)
    {
        $user = $event->getObject();
        if (!$user instanceof User) return;

        // Update only if required
        $oldUser = $this->baseService->getOriginalEntity($user, User::class);

        if($user->isApproved() && !$oldUser->isApproved())
            $this->events[spl_object_id($user)][] = UserEvent::VALIDATE;
    }

    public function postPersist(LifecycleEventArgs $event): void
    {
        $user = $event->getObject();
        if (!$user instanceof User) return;

        $this->dispatchEvents($user);
    }

    public function postUpdate(LifecycleEventArgs $event): void
    {
        $user = $event->getObject();
        if (!$user instanceof User) return;

        $this->dispatchEvents($user);
    }

    public function preRemove(LifecycleEventArgs $event): void
    {
        $user = $event->getObject();
        if (!$user instanceof User) return;

        $impersonator = null;
        if ($this->tokenStorage->getToken() instanceof SwitchUserToken)
            $impersonator = $this->tokenStorage->getToken()->getOriginalToken()->getUser();

        if($impersonator == $this->tokenStorage->getToken()->getUser() || $user == $this->tokenStorage->getToken()->getUser())
            throw new Exception("Unauthorized action: you can't delete your own account");
    }

    public function dispatchEvents($user)
    {
        $id = spl_object_id($user);
        if (!array_key_exists($id, $this->events)) return;

        foreach ($this->events[$id] as $event)
            $this->dispatcher->dispatch(new UserEvent($user), $event);
    }

}
