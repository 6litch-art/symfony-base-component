<?php

namespace Base\Security;

use App\Entity\User;
use Base\Entity\User\Notification;
use Base\Service\BaseService;
use Exception;
use Symfony\Component\Security\Core\Exception\AccountExpiredException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAccountStatusException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserChecker implements UserCheckerInterface
{
    protected $translator;
    public function __construct(BaseService $baseService) { $this->translator = $baseService->getTranslator(); }

    public function checkPreAuth(UserInterface $user)
    {
        if (!$user instanceof User) return;

        if (!$user->isApproved())
            throw new CustomUserMessageAccountStatusException(
               $this->translator->trans("login.pending", [], "notifications")
            );

        if ($user->isBanned())
            throw new CustomUserMessageAccountStatusException(
                $this->translator->trans("login.banned", [], "notifications")
            );
    }

    public function checkPostAuth(UserInterface $user)
    {
        if (!$user instanceof User) return;
    }
}