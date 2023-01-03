<?php

namespace Base\EntitySubscriber;

use App\Repository\UserRepository;
use Base\Entity\User\Notification;
use Base\Entity\User\Token;
use Base\EntityDispatcher\Event\UserEvent;
use Base\Routing\RouterInterface;
use Base\Service\BaseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class UserSubscriber implements EventSubscriberInterface
{
    /**
     * @var RouterInterface
     */
    protected $router;

    /**
     * @var TokenStorage
     */
    protected $tokenStorage;

    /**
     * @var EntityManager
     */
    protected $entityManager;

    public function __construct(EntityManagerInterface $entityManager, TokenStorageInterface $tokenStorage, RouterInterface $router){

        $this->entityManager = $entityManager;
        $this->router        = $router;
        $this->tokenStorage  = $tokenStorage;
    }

    public static function getSubscribedEvents() : array
    {
        return
        [
            UserEvent::REGISTER => ['onRegistration'],
            UserEvent::APPROVAL => ['onApproval'],
            UserEvent::VERIFIED => ['onVerification'],
            UserEvent::ENABLED  => ['onEnabling'],
            UserEvent::DISABLED => ['onDisabling'],
            UserEvent::KICKED   => ['onKickout']
        ];
    }

    public function onEnabling(UserEvent $event)
    {
        $user = $event->getUser();
        if($this->tokenStorage->getToken()->getUser() != $user) return; // Only notify when user requests itself

        $notification = new Notification("accountWelcomeBack.success", [$user]);
        $notification->setUser($user);

        if($this->tokenStorage->getToken()->getUser() == $user)
            $notification->send("success");
    }

    public function onDisabling(UserEvent $event)
    {
        $user = $event->getUser();
        if($this->tokenStorage->getToken()->getUser() != $user) return; // Only notify when user requests itself

        $notification = new Notification("accountGoodbye.success", [$user]);
        $notification->setUser($user);
        $notification->setHtmlTemplate("@Base/security/email/account_goodbye.html.twig");

            $notification->send("success")->send("email");
    }

    public function onKickout(UserEvent $event) { }

    public function onVerification(UserEvent $event) { }

    public function onRegistration(UserEvent $event)
    {
        $token = $this->tokenStorage->getToken();

        $user = $event->getUser();
        if($token && $token->getUser() != $user) return; // Only notify when user requests itself

        if ($user->isVerified()) { // Social account connection

            $notification = new Notification("verifyEmail.success");
            $notification->setUser($user);
            $notification->send("success");

        } else {

            /**
             * @var \App\Entity\User\Token
             */
            $verifyEmailToken = new Token('verify-email', 3600);
            $user->addToken($verifyEmailToken);

            $notification = new Notification('verifyEmail.check');
            $notification->setUser($user);
            $notification->setHtmlTemplate('@Base/security/email/verify_email.html.twig', ["token" => $verifyEmailToken]);

            $notification->send("email")->send("success");
        }

        $this->router->redirectToRoute("user_profile", [], 302);
    }

    public function onApproval(UserEvent $event)
    {
        $user = $event->getUser();

        $adminApprovalToken = $user->getValidToken("admin-approval");
        if ($adminApprovalToken) {

            $adminApprovalToken->revoke();

            $notification = new Notification("adminApproval.approval");
            $notification->setUser($user);
            $notification->setHtmlTemplate("@Base/security/email/admin_approval_confirm.html.twig");
            $notification->send("email");
        }
    }
}
