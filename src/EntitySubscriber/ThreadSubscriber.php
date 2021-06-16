<?php

namespace Base\EntitySubscriber;

use App\Entity\Thread;
use App\EntityEvent\ThreadEvent;
use Base\Service\BaseService;
use Base\Form\Type\RoleType;

use Doctrine\ORM\Events;
use Doctrine\Common\EventSubscriber;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\EventDispatcher\Debug\TraceableEventDispatcher;

class ThreadSubscriber implements EventSubscriber
{
    protected array $events;
    public function __construct(TraceableEventDispatcher $dispatcher) {
        $this->dispatcher = $dispatcher;
        $this->events = [];
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
        $thread = $event->getObject();
        if (!$thread instanceof Thread) return;

        // Update publishable articles
        if ($thread->isFuture() && $thread->isPublishable())
            $thread->setState(Thread::STATE_PUBLISHED);

        if ($thread->isPublish())
            $this->events[spl_object_id($thread)][] = ThreadEvent::PUBLISH;
    }

    public function preUpdate(LifecycleEventArgs $event)
    {
        $thread = $event->getObject();
        if (!$thread instanceof Thread) return;

        // Update publishable articles
        if ($thread->isFuture() && $thread->isPublishable()) {

            $thread->setState(Thread::STATE_PUBLISHED);
            $this->events[spl_object_id($thread)][] = ThreadEvent::PUBLISH;
        }
    }

    public function postPersist(LifecycleEventArgs $event): void
    {
        $thread = $event->getObject();
        if (!$thread instanceof Thread) return;

        $this->dispatchEvents($thread);
    }

    public function postUpdate(LifecycleEventArgs $event): void
    {
        $thread = $event->getObject();
        if (!$thread instanceof Thread) return;

        $this->dispatchEvents($thread);
    }

    public function dispatchEvents($thread) {

        $id = spl_object_id($thread);
        if(!array_key_exists($id, $this->events)) return;

        foreach($this->events[$id] as $event)
            $this->dispatcher->dispatch(new ThreadEvent($thread), $event);
    }
}
