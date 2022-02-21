<?php

namespace Base\Subscriber;

use Base\Component\HttpFoundation\Referrer;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Base\Entity\User;

use Base\Service\BaseService;
use Base\Entity\Extension\Log;
use Base\Security\LoginFormAuthenticator;

use Symfony\Component\HttpKernel\Event\KernelEvent;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

use Base\Entity\User\Notification;
use Base\Entity\User\Token;
use Base\EntityEvent\UserEvent;
use Base\Enum\UserRole;
use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\DependencyInjection\Argument\ServiceLocator;
use Symfony\Component\EventDispatcher\Debug\TraceableEventDispatcher;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\Event\TerminateEvent;
use Symfony\Component\Security\Core\Authentication\Token\SwitchUserToken;
use Symfony\Component\Security\Http\Event\LogoutEvent;
use Symfony\Component\Security\Http\Event\SwitchUserEvent;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationChecker;
use Symfony\Component\Security\Http\Event\LoginFailureEvent;
use Symfony\Component\Security\Http\Event\LoginSuccessEvent;
use Symfony\Contracts\Translation\TranslatorInterface;

class SecuritySubscriber implements EventSubscriberInterface
{
    /**
     * @var BaseService
     */
    private $baseService;

    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    /**
     * @var array[TraceableEventDispatcher]
     */
    private $dispatchers = [];

    public function __construct(
        EntityManagerInterface $entityManager,
        AuthorizationChecker $authorizationChecker,
        TokenStorageInterface $tokenStorage,
        ServiceLocator $dispatcherLocator,
        TranslatorInterface $translator,
        BaseService $baseService,
        Referrer $referrer) {

        $this->authorizationChecker = $authorizationChecker;
        $this->tokenStorage = $tokenStorage;
        $this->translator  = $translator;
        $this->entityManager = $entityManager;
        $this->baseService = $baseService;
        $this->referrer = $referrer;
        
        foreach($dispatcherLocator->getProvidedServices() as $dispatcherId => $_) {

            $dispatcher = $dispatcherLocator->get($dispatcherId);
            if (!$dispatcher instanceof TraceableEventDispatcher) continue;

            $this->dispatchers[] = $dispatcherLocator->get($dispatcherId);
        }

        $this->exceptions = [
            "/^locale_/", 
            "/^ux_/", 
            "/^user(?:.*)$/", 
            "/^security(?:.*)$/",
        ];
    }

    public static function getSubscribedEvents(): array
    {
        return [
            SwitchUserEvent::class => ['onSwitchUser'],

            /* referer goes first, because kernelrequest then redirects consequently if user not verified */
            RequestEvent::class    => [['onReferrerRequest', 2], ['onKernelRequest', 1]],
            ResponseEvent::class   => ['onKernelResponse'],
            TerminateEvent::class  => ['onKernelTerminate'],
            ExceptionEvent::class  => ['onKernelException', -1024],

            LoginSuccessEvent::class => ['onLoginSuccess'],
            LoginFailureEvent::class => ['onLoginFailure'],
            LogoutEvent::class       => ['onLogout'],

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
            $notification->send("success");

        } else {

            $verifyEmailToken = new Token('verify-email', 3600);
            $user->addToken($verifyEmailToken);

            $notification = new Notification('verifyEmail.check');
            $notification->setUser($user);
            $notification->setHtmlTemplate('@Base/security/email/verify_email.html.twig', ["token" => $verifyEmailToken]);

            $this->baseService->getEntityManager()->flush();
            $notification->send("email")->send("success");
        }

        $this->baseService->getEntityManager()->flush();
        $this->baseService->redirectToRoute("user_profile", [], 302);
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

        $this->baseService->getEntityManager()->flush();
    }

    public function onSwitchUser(SwitchUserEvent $event) { }

    public function getCurrentRoute($event) { return $event->getRequest()->get('_route'); }

    public function isException($route)
    {
        $exceptions = is_string($this->exceptions) ? [$this->exceptions] : $this->exceptions;
        foreach($exceptions as $pattern) 
            if (preg_match($pattern, $route)) return true;

        return false;
    }

    public function onReferrerRequest(RequestEvent $event) 
    {
        if(!$event->isMainRequest()) return;
        if($this->baseService->isProfiler()) return;

        $targetPath = strval($this->referrer);
        $targetRoute = $this->baseService->getRoute($targetPath);

        $currentRoute = $this->getCurrentRoute($event);
        if($this->isException($currentRoute)) return;
        
        $event->getRequest()->getSession()->remove('_security.main.target_path');
        $event->getRequest()->getSession()->remove('_security.account.target_path');

        if ($currentRoute != $targetRoute &&
            $currentRoute != LoginFormAuthenticator::LOGOUT_ROUTE &&
            $currentRoute != LoginFormAuthenticator::LOGIN_ROUTE) {

            $event->getRequest()->getSession()->set('_target_path', null);

        } else {

            $event->getRequest()->getSession()->set('_target_path', $targetPath);
        }

        if ($targetPath && 
            $targetRoute != LoginFormAuthenticator::LOGOUT_ROUTE &&
            $targetRoute != LoginFormAuthenticator::LOGIN_ROUTE ) 
        return $this->baseService->redirect($targetPath, [], 302);
    }

    public function onKernelRequest(RequestEvent $event)
    {
        //Notify user about the authentication method
        if(!($token = $this->tokenStorage->getToken()) ) return;
        if(!($user = $token->getUser())) return;

        $exceptions = array_merge($this->exceptions, ["/^(?:app|base)_user(?:.*)$/"]);
        if ($this->authorizationChecker->isGranted('IS_IMPERSONATOR')) {

            $notification = new Notification("impersonator", [$user]);
            $notification->send("warning");
        }

        if($user->isDirty()) $user->kick();
        if($user->isKicked()) {

            $notification = new Notification("kickout", [$user]);
            $notification->send("warning");

            $this->referrer->setUrl($event->getRequest()->getUri());
            $event->setResponse($this->baseService->redirectToRoute("security_logoutRequest"));

            if(!$user->isDirty()) $this->entityManager->flush($user);
            return $event->stopPropagation();
        }

        if ($this->authorizationChecker->isGranted(UserRole::ADMIN)) {
            $user->approve();
            $this->entityManager->flush($user);

        } else if($this->baseService->getParameterBag("base.user.autoapprove")) {
            $user->approve();
            $this->entityManager->flush($user);
        }
        
        if (! $user->isVerified()) {

            $callbackFn = function () use ($user) {

                $verifyEmailToken = $user->getToken("verify-email");
                if($verifyEmailToken && $verifyEmailToken->hasVeto()) {

                    $notification = new Notification("verifyEmail.alreadySent", [$verifyEmailToken->getDeadtimeStr()]);
                    $notification->send("info");

                } else {

                    $notification = new Notification("verifyEmail.pending", [$this->baseService->getUrl("security_verifyEmail")]);
                    $notification->send("warning");
                }
            };

            $response    = $event->getResponse();
            $redirection = $response && $response->getStatusCode() == 302;
            if($redirection || $this->baseService->isEasyAdmin() || $this->baseService->isProfiler()) $callbackFn();
            else $this->baseService->redirectToRoute("user_profile", [], 302, ["event" => $event, "exceptions" => $exceptions, "callback" => $callbackFn]);

        } else {

            if (! $user->isApproved()) {

                $this->baseService->redirectToRoute("user_profile", [], 302, ["event" => $event, "exceptions" => $exceptions, "callback" => function() {

                    $notification = new Notification("login.pending");
                    $notification->send("warning");
                }]);

            }
        }
    }

    public function onKernelResponse(ResponseEvent $event)
    {
        //Notify user about the authentication method
        if(!($token = $this->tokenStorage->getToken()) ) return;
        if(!($user = $token->getUser())) return;

        if ( !($user->isActive()) ) {
    
            $user->poke(new \DateTime("now"));
            $this->entityManager->flush();
        }
    }
    
    public function onLoginFailure(LoginFailureEvent $event)
    {
        $message = "@notifications.login.failed";
        $importance = "danger";
        $data = [];

        if( ($exception = $event->getException()) ) {

            $importance = $exception->getMessageData()["importance"] ?? $importance;
            $data = $exception->getMessageData();

            $message = $this->translator->trans($exception->getMessageKey() ?? $message, $data, "security");
        }

        $notification = new Notification($message, $data);
        $notification->send($importance);
    }

    public function onLoginSuccess(LoginSuccessEvent $event)
    {
        // Notify user about the authentication method
        if ($user = $event->getUser()) {

            if (!$user->isPersistent()) {

                $notification = new Notification("login.social", [$user]);
                $notification->send("success");

            } else if($user->isVerified()) {

                if ($this->authorizationChecker->isGranted('IS_AUTHENTICATED_FULLY'))
                    $title = "@notifications.login.success.normal";
                else if ($this->authorizationChecker->isGranted('IS_AUTHENTICATED_REMEMBERED'))
                    $title = "@notifications.login.success.back";
                else
                    $title = "@notifications.login.success.alien";

                $notification = new Notification($title, [$user]);
                $notification->send("success");
            }
        }
    }

    private $_onLogoutUser = null;
    private $_onLogoutImpersonator = null;
    public function onLogout(LogoutEvent $event)
    {
        $token = $event->getToken();
        $user = ($token) ? $token->getUser() : null;
        $impersonator = ($token instanceof SwitchUserToken ? $token->getOriginalToken()->getUser() : null);

        if ($user instanceof User) // Just to remember username.. after logout & first redirection
            $this->baseService->addSession("_user", $user);

        // Get back onLogout token information (to be used to store logs)
        $this->_onLogoutUser = $user;
        $this->_onLogoutImpersonator = $impersonator;

        return $this->baseService->redirectToRoute(LoginFormAuthenticator::LOGOUT_ROUTE, [], 302, ["event" => $event]);
    }

    public function onStoreLog(KernelEvent $event, ?\Throwable $exception = null) {

        if (self::$exceptionOnHold && self::$exceptionOnHold != $exception)
            return;

        if (!$event->isMainRequest()) return;
        $request = $event->getRequest();

        // Handle security (not mandatory, $user is null if not defined)
        $token = $this->tokenStorage->getToken();
        $impersonator = ($token instanceof SwitchUserToken ? $token->getOriginalToken()->getUser() : $this->_onLogoutImpersonator);
        $user = ($token ? $token->getUser() : $this->_onLogoutUser);
        if(!$user) return;

        // Monitored listeners
        $monitoredEntries = $this->baseService->getParameterBag("base.logging") ?? [];
        if(!$monitoredEntries) return;

        // Format monitored entries
        foreach ($monitoredEntries as $key => $entry) {

            if (!array_key_exists("event", $monitoredEntries[$key]))
                throw new Exception("Missing key \"event\" in monitored events #" . $key);
            if (!array_key_exists("pretty", $monitoredEntries[$key]))
                $monitoredEntries[$key]["pretty"] = "*";
            if (!array_key_exists("statusCode", $monitoredEntries[$key]))
                $monitoredEntries[$key]["statusCode"] = "*";

            $monitoredEntries[$key]["pretty"] = str_replace("\\", "\\\\", $monitoredEntries[$key]["pretty"]);
            $monitoredEntries[$key]["pretty"] = trim(ltrim($monitoredEntries[$key]["pretty"], '\\'));
            $monitoredEntries[$key]["pretty"] = "/" . $monitoredEntries[$key]["pretty"] . "/";
            if ($monitoredEntries[$key]["pretty"] == "/*/")
                $monitoredEntries[$key]["pretty"] = "/.*/";

            $monitoredEntries[$key]["statusCode"] = trim($monitoredEntries[$key]["statusCode"]);
            $monitoredEntries[$key]["statusCode"] = "/" . $monitoredEntries[$key]["statusCode"] . "/";
            if ($monitoredEntries[$key]["statusCode"] == "/*/")
                $monitoredEntries[$key]["statusCode"] = "/.*/";
        }

        // Check called listeners
        $calledListeners = [];
        foreach($this->dispatchers as $dispatcher)
            $calledListeners = array_merge($calledListeners, $dispatcher->getCalledListeners());

        foreach ($calledListeners as $listener) {

            if (!array_key_exists("event", $listener))
                throw new Exception("Array key \"event\" missing in dispatcher listener");
            if (!array_key_exists("pretty", $listener))
                throw new Exception("Array key \"pretty\" missing in dispatcher listener");

            $event  = $listener["event"];
            $pretty = $listener["pretty"];
            
            foreach ($monitoredEntries as $monitoredEntry) {

                $monitoredStatusCode = $monitoredEntry["statusCode"];
                $monitoredPretty   = $monitoredEntry["pretty"];
                $monitoredEvent      = $monitoredEntry["event"];
                if ($monitoredEvent != $event)                   continue;

                if($event == "kernel.exception") {

                    // If kernel exception, listener regex is inhibited
                    if ($pretty != __CLASS__ . "::onKernelException") continue;

                    // Handle exception
                    if ($exception == null) continue;

                    if ($exception instanceof HttpException && !preg_match($monitoredStatusCode, $exception->getStatusCode())) continue;
                    else if (!preg_match($monitoredStatusCode, $exception->getCode())) continue;

                } else if (!preg_match($monitoredPretty, $pretty)) continue; // Else just check the provided regex

                // Entity Manager closed means most likely an exception
                // due within doctrine execution happened
                $entityManager = $this->baseService->getEntityManager(true);
                if (!$entityManager || !$entityManager->isOpen()) return;

                // In the opposite case, we are storing the exception
                $log = new Log($listener, $request);
                $log->setException($exception ?? null);
                $log->setImpersonator($impersonator);
                $log->setUser($user);

                $entityManager->persist($log);
                $entityManager->flush();
            }
        }
    }

    public function onKernelTerminate(TerminateEvent $event)
    {
        if(!$this->baseService->isDebug()) return;
        return $this->onStoreLog($event);
    }

    private static $exceptionOnHold = null;
    public function onKernelException(ExceptionEvent $event)
    {
        if(!$this->baseService->isDebug()) return;
        $exception = $event->getThrowable();

        // Initial exception held here, this is in case of nested exceptions..
        // This guard must be set here, otherwise you are going to miss the first exception..
        // In case the initial exception is related to doctrine, entity manager will be closed.
        if(self::$exceptionOnHold)
            throw self::$exceptionOnHold;

        self::$exceptionOnHold = $exception;
        $this->onStoreLog($event, $exception);
        self::$exceptionOnHold = null;
    }
}
