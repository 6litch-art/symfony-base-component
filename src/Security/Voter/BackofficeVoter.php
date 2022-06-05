<?php

namespace Base\Security\Voter;

use App\Entity\User;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class BackofficeVoter extends Voter
{
    const BACKOFFICE = "BACKOFFICE";

    public function __construct(RouterInterface $router) { $this->router = $router; }

    protected function supports(string $attribute, mixed $subject): bool
    {
        // Voter only support "User" objects and one specific ballot type..
        return $this->router->isBackOffice() && $attribute == self::BACKOFFICE;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        //
        // Check if current user is authenticated
        $user = $token->getUser();
        return $user && $user->isGranted("ROLE_ADMIN");
    }
}