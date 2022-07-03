<?php

namespace Base\Subscriber;

use Base\Service\ReferrerInterface;
use Base\Entity\User;

use Base\Service\BaseService;
use Base\Security\LoginFormAuthenticator;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;

use Base\Entity\User\Notification;
use Base\Enum\UserRole;
use Base\Security\RescueFormAuthenticator;
use Base\Service\LocaleProvider;
use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Profiler\Profiler;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Http\Event\LogoutEvent;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationChecker;
use Symfony\Component\Security\Http\Event\LoginFailureEvent;
use Symfony\Component\Security\Http\Event\LoginSuccessEvent;
use Symfony\Contracts\Translation\TranslatorInterface;

use Base\Service\ParameterBagInterface;

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

    public function __construct(
        EntityManagerInterface $entityManager,
        AuthorizationChecker $authorizationChecker,
        TokenStorageInterface $tokenStorage,
        TranslatorInterface $translator,
        BaseService $baseService,
        LocaleProvider $localeProvider,
        ReferrerInterface $referrer,
        RouterInterface $router,
        ParameterBagInterface $parameterBag,
        ?Profiler $profiler = null) {

        $this->authorizationChecker = $authorizationChecker;
        $this->tokenStorage = $tokenStorage;
        $this->translator  = $translator;
        $this->router  = $router;

        $this->localeProvider = $localeProvider;
        $this->entityManager = $entityManager;
        $this->userRepository = $entityManager->getRepository(User::class);

        $this->baseService = $baseService;
        $this->referrer = $referrer;
        $this->profiler = $profiler;
        $this->exceptions = [
            "/^locale_/",
            "/^ux_/",
            "/^user(?:.*)$/",
            "/^security(?:.*)$/",
        ];

        $this->parameterBag = $parameterBag;
        $this->maintenanceException   = $this->parameterBag->get("base.maintenance.exception");
        $this->maintenanceException[] = "security_rescue";

        $this->homepageRoute = $this->parameterBag->get("base.homepage");
        $this->maintenanceRoute = $this->parameterBag->get("base.maintenance.redirect");

    }

    public static function getSubscribedEvents(): array
    {
        return [

            /* referer goes first, because kernelrequest then redirects consequently if user not verified */
            RequestEvent::class    => [
                ['onAccessRequest', 6], 
                ['onReferrerRequest', 5], ['onKernelRequest', 5], 
            ],

            ResponseEvent::class   => ['onKernelResponse'],
            LoginSuccessEvent::class => ['onLoginSuccess'],
            LoginFailureEvent::class => ['onLoginFailure'],
            LogoutEvent::class       => ['onLogout'],
        ];
    }

    public function getCurrentRouteName($event) { return $event->getRequest()->get('_route'); }

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
        $targetRoute = $this->baseService->getRouteName($targetPath);

        $currentRoute = $this->getCurrentRouteName($event);
        if($this->isException($currentRoute)) return;

        $session = $event->getRequest()->getSession();
        $session->remove('_security.main.target_path');    // Internal definition by firewall
        $session->remove('_security.account.target_path'); // Internal definition by firewall

        $currentRouteIsLoginForm = in_array($currentRoute, [
            LoginFormAuthenticator::LOGOUT_ROUTE,
            LoginFormAuthenticator::LOGOUT_REQUEST_ROUTE,
            LoginFormAuthenticator::LOGIN_ROUTE,
            RescueFormAuthenticator::LOGIN_ROUTE]
        );

        $session->set('_target_path', $currentRoute == $targetRoute || $currentRouteIsLoginForm ? $targetPath : null);

        $targetRouteIsLoginForm = in_array($targetRoute, [
            LoginFormAuthenticator::LOGOUT_ROUTE,
            LoginFormAuthenticator::LOGOUT_REQUEST_ROUTE,
            LoginFormAuthenticator::LOGIN_ROUTE,
            RescueFormAuthenticator::LOGIN_ROUTE]
        );

        if ($targetPath && !$targetRouteIsLoginForm)
            return $this->baseService->redirect($targetPath, [], 302);
    }

    public function onAccessRequest(RequestEvent $event)
    {
        if(!$event->isMainRequest()) return;
        if( $this->router->isWdt($event) ) return; // Special case for _wdt

        $token = $this->tokenStorage->getToken();
        $user = $token ? $token->getUser() : null;

        //
        // Redirect if basic access not granted
        $adminAccess      = $this->authorizationChecker->isGranted("ADMIN_ACCESS");
        $userAccess       = $this->authorizationChecker->isGranted("USER_ACCESS");
        $anonymousAccess  = $this->authorizationChecker->isGranted("ANONYMOUS_ACCESS");
        
        $accessRestricted = !$adminAccess || !$userAccess || !$anonymousAccess;
        if($accessRestricted) {

            //
            // Check for user special grants (based on roles)
            $specialGrant = $this->authorizationChecker->isGranted("ANONYMOUS_ACCESS", $user);
            if(!$specialGrant) $specialGrant = $this->authorizationChecker->isGranted("USER_ACCESS", $user);
            if(!$specialGrant) $specialGrant = $this->authorizationChecker->isGranted("ADMIN_ACCESS", $user);

            if($user != null && $specialGrant) {

                     if(!$adminAccess) $msg = "admin_restriction";
                else if(!$userAccess)  $msg = "user_restriction";
                else $msg = "public_restriction";

                if(!$this->localeProvider->hasChanged()) {

                    $notification = new Notification("access_restricted.".$msg);
                    $notification->send("warning");
                }

                return;
            }

            // In case of restriction: profiler is disabled
            if($this->profiler) $this->profiler->disable();

            // Rescue authenticator must always be public
            $isSecurityRoute = RescueFormAuthenticator::isSecurityRoute($event->getRequest());
            if($isSecurityRoute) return;

            //
            // Prevent average guy to see the administration and debug tools
            if($this->baseService->isProfiler() && !$this->authorizationChecker->isGranted("BACKEND"))
                throw new NotFoundHttpException();

            if($this->baseService->isEasyAdmin() && !$this->authorizationChecker->isGranted("BACKEND"))
                if(!$isSecurityRoute) throw new NotFoundHttpException();

            // Nonetheless exception access is always possible
            if($this->authorizationChecker->isGranted("EXCEPTION_ACCESS"))
                return;

            // If not, then user is redirected to a specific route
            $currentRouteName = $this->router->getRouteName();
            $accessDeniedRedirection = $this->baseService->getSettingBag()->getScalar("base.settings.access_denied_redirect");
            if($currentRouteName != $accessDeniedRedirection) {

                $response   = $accessDeniedRedirection ? $this->baseService->redirect($accessDeniedRedirection) : null;
                $response ??= $this->baseService->redirect(RescueFormAuthenticator::LOGIN_ROUTE);

                $event->setResponse($response);
                return $event->stopPropagation();
            }
        }
    }

    public function onKernelRequest(RequestEvent $event)
    {
        $token = $this->tokenStorage->getToken();

        /**
         * @var User
         */
        $user = $token ? $token->getUser() : null;
        if(!$user) return;

        // Notify user about the authentication method
        $exceptions = array_merge($this->exceptions, ["/^(?:app|base)_user(?:.*)$/"]);
        if ($this->authorizationChecker->isGranted('IS_IMPERSONATOR')) {

            $notification = new Notification("impersonator", [$user]);
            $notification->send("warning");
        }

        if($user->isKicked()) {

            $notification = new Notification("kickout", [$user]);
            $notification->send("warning");

            $this->referrer->setUrl($event->getRequest()->getUri());
            $event->setResponse($this->baseService->redirectToRoute(LoginFormAuthenticator::LOGOUT_REQUEST_ROUTE));

            $this->userRepository->flush($user);
            return $event->stopPropagation();
        }

        if ($this->authorizationChecker->isGranted(UserRole::ADMIN)) {

            $user->approve();
            $this->userRepository->flush($user);

        } else if($this->baseService->getthis->parameterBag("base.user.autoapprove")) {

            $user->approve();
            $this->userRepository->flush($user);
        }

        //
        // Check if user is verified
        // (NB:exception in debut mode for user matching test_recipient emails)
        if (!$user->isVerified() && !$user->isTester()) {

                $callbackFn = function () use ($user) {

                    $verifyEmailToken = $user->getToken("verify-email");
                    if($verifyEmailToken && $verifyEmailToken->hasVeto()) {

                        $notification = new Notification("verifyEmail.alreadySent", [$verifyEmailToken->getDeadtimeStr()]);
                        $notification->send("info");

                    } else {

                        $notification = new Notification("verifyEmail.pending", [$this->baseService->generateUrl("security_verifyEmail")]);
                        $notification->send("warning");
                    }
                };

                $response    = $event->getResponse();
                $redirection = $response && $response->getStatusCode() == 302;
                if($redirection || $this->baseService->isEasyAdmin() || $this->baseService->isProfiler()) $callbackFn();
                else $this->baseService->redirectToRoute("user_profile", [], 302, ["event" => $event, "exceptions" => $exceptions, "callback" => $callbackFn]);
        }

        if (! $user->isApproved()) {

            $this->baseService->redirectToRoute("user_profile", [], 302, ["event" => $event, "exceptions" => $exceptions, "callback" => function() {

                $notification = new Notification("login.pending");
                $notification->send("warning");
            }]);

        }
    }

    public function onKernelResponse(ResponseEvent $event)
    {
        //Notify user about the authentication method
        if(!($token = $this->tokenStorage->getToken()) ) return;

        /**
         * @var User
         */
        if(!($user = $token->getUser())) return;

        if ( !($user->isActive()) ) {

            $user->poke(new \DateTime("now"));
            $this->userRepository->flush($user);
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
        /**
         * @var User
         */
        if ($user = $event->getUser()) {

            if (!$user->isPersistent()) {

                $notification = new Notification("login.social", [$user]);
                $notification->send("success");

            } else if($user->isVerified()) {

                $isAuthenticated = $this->authorizationChecker->isGranted('IS_AUTHENTICATED_FULLY') || $this->authorizationChecker->isGranted('IS_AUTHENTICATED_REMEMBERED');
                if($isAuthenticated) {

                    $active = daydiff($user->getActiveAt()) < 0 ? "first" : "back";

                         if(time_is_between($user->getActiveAt(), "05:00:00", "10:00:00")) $period = "morning";
                    else if(time_is_between($user->getActiveAt(), "12:00:00", "15:00:00")) $period = "afternoon";
                    else if(time_is_between($user->getActiveAt(), "19:00:00", "05:00:00")) $period = "evening";
                    else $period = "day";

                    $title = "@notifications.login.success.$period.$active";

                } else {

                    $title = "@notifications.login.success.alien";
                }

                $notification = new Notification($title, [$user]);
                $notification->send("success");
            }
        }
    }

    public function onLogout(LogoutEvent $event)
    {
        $token = $event->getToken();
        $user = ($token) ? $token->getUser() : null;

        if ($user instanceof User) // Just to remember username.. after logout & first redirection
            $this->baseService->addSession("_user", $user);

        return $this->baseService->redirectToRoute(LoginFormAuthenticator::LOGOUT_ROUTE, [], 302, ["event" => $event]);
    }





    public function onMaintenance(RequestEvent $event)
    {
        // Exception triggered
        if( empty( $this->router->getRouteName()) ) return;

        if(!$this->baseService->isMaintenance()) {

            if(preg_match('/^'.$this->maintenanceRoute.'/', $this->router->getRouteName()))
                $this->router->redirectToRoute($this->homepageRoute, [], 302, ["event" => $event]);

            return;
        }

        if($this->baseService->getUser() && $this->baseService->isGranted("ROLE_EDITOR")) {

            $notification = new Notification("maintenance.banner");
            $notification->send("warning");
            return;
        }

        // Disconnect user
        $this->baseService->Logout();

        // Apply redirection to maintenance page
        $isException = preg_match('/^'.$this->maintenanceRoute.'/', $this->router->getRouteName());
        foreach($this->maintenanceException as $exception)
            $isException |= preg_match('/^'.$exception.'/', $this->router->getRouteName());

        if (!$isException)
            $this->router->redirectToRoute($this->maintenanceRoute, [], 302, ["event" => $event]);

        // Stopping page execution
        $event->stopPropagation();
    }

    public function onBirth(RequestEvent $event)
    {
        if( empty( $this->router->getRouteName()) ) return;

        if($this->router->isProfiler() ) return;
        if($this->router->isEasyAdmin()) return;
        if($this->baseService->isBorn()) return;

        dump($this->isAccessRestricted($this->baseService->getUser()));
        if(!$this->isAccessRestricted($this->baseService->getUser())) return;
        if(!$this->router->getRouteFirewall()->isSecurityEnabled()) return;

        if($this->baseService->getUser() && $this->baseService->isGranted("ROLE_EDITOR")) {

            $notification = new Notification("birth.banner");
            $notification->send("warning");
            return;
        }

        if($this->router->getRouteName() != "security_birth") {
            $this->router->redirectToRoute("security_birth", [], 302, ["event" => $event]);
            $event->stopPropagation();
        }
    }

}
