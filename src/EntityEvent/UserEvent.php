<?php

namespace Base\EntityEvent;

use Base\Entity\User;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * The order.placed event is dispatched each time an order is created
 * in the system.
 */
class UserEvent extends Event
{
    public const REGISTER = 'user.register';
    public const VALIDATE = 'user.validate';

    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function getUser(): User
    {
        return $this->user;
    }
}