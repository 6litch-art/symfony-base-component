<?php

namespace Base\Controller;

use App\Entity\User;

use Base\Entity\User\Notification;
use Base\Notifier\NotifierInterface;
use Base\Routing\RouterInterface;
use Base\Security\LoginFormAuthenticator;

use App\Form\Type\SecurityRegistrationType;
use App\Form\Type\SecurityLoginType;
use Base\Annotations\Annotation\IsGranted;

use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;

use Base\Entity\User\Token;
use Base\Form\Type\SecurityResetPasswordType;
use App\Repository\UserRepository;
use Base\Annotations\Annotation\Iconize;
use Base\Form\FormProxy;
use Base\Form\FormProcessorInterface;
use Base\Service\ReferrerInterface;
use Base\Form\Type\SecurityResetPasswordConfirmType;
use Base\Repository\User\TokenRepository;

use Base\Security\RescueFormAuthenticator;
use Base\Service\MaintenanceProviderInterface;
use Base\Service\MaternityUnitInterface;
use Base\Service\ParameterBagInterface;
use Base\Service\TranslatorInterface;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\RememberMeBadge;

class SecurityController extends AbstractController
{
    /**
     * @var Translator
     */
    protected $translator;

    /**
     * @var TokenStorage
     */
    protected $tokenStorage;

    /**
     * @var FormProxy
     */
    protected $formProxy;

    /**
     * @var Notifier
     */
    protected $notifier;

    /**
     * @var RouterInterface
     */
    protected $router;

    /**
     * @var ParameterBag
     */
    protected $parameterBag;

    /**
     * @var EntityManagerInterface
     */
    protected $entityManager;

    /**
     * @var UserRepository
     */
    protected $userRepository;

    /**
     * @var TokenRepository
     */
    protected $tokenRepository;

    public function __construct(
        NotifierInterface $notifier,
        EntityManagerInterface $entityManager,
        TokenRepository $tokenRepository,
        UserRepository $userRepository,
        RouterInterface $router,
        FormProxy $formProxy,
        TokenStorageInterface $tokenStorage,
        TranslatorInterface $translator,
        ParameterBagInterface $parameterBag
    )
    {
        $this->router          = $router;
        $this->translator      = $translator;
        $this->tokenStorage    = $tokenStorage;
        $this->formProxy       = $formProxy;
        $this->parameterBag    = $parameterBag;
        $this->notifier        = $notifier;

        $this->entityManager   = $entityManager;
        $this->userRepository  = $userRepository;
        $this->tokenRepository = $tokenRepository;
    }

    /**
     * @Route("/login", name="security_login")
     * @Iconize("fa-solid fa-fw fa-arrow-right-to-bracket")
     */
    public function Login(Request $request, ReferrerInterface $referrer, AuthenticationUtils $authenticationUtils): Response
    {
        // In case of maintenance, still allow users to login
        if ($this->isGranted("EXCEPTION_ACCESS")) {
            return $this->redirectToRoute(RescueFormAuthenticator::LOGIN_ROUTE);
        }

        // Last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        // Redirect to the right page when access denied
        if (($user = $this->getUser())) {
            // Remove expired tokens
            $user->removeExpiredTokens();

            if ($this->isGranted('IS_AUTHENTICATED_FULLY')) {
                return $this->redirect($referrer->getUrl() ?? $this->router->getUrlIndex());
            }

            $notification = new Notification("login.partial");
            $notification->send("info");
        }

        // Generate form
        $formProcessor = $this->formProxy
            ->createProcessor("form:login", SecurityLoginType::class, ["identifier" => $lastUsername])
            ->handleRequest($request);

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', [
            "identifier" => $lastUsername,
            "form" => $formProcessor->getForm()->createView(),
            "last_username" => $lastUsername,
            "error" => $error
        ]);
    }

    /**
     * @Route("/logout", name="security_logout")
     * @Iconize("fa-solid fa-fw fa-right-from-bracket")
     */
    public function Logout(Request $request, ReferrerInterface $referrer)
    {
        // If user is found.. go to the logout request page
        if ($this->getUser()) {
            $response = $this->redirectToRoute(LoginFormAuthenticator::LOGOUT_REQUEST_ROUTE);
            $response->headers->clearCookie('REMEMBERME', "/");
            $response->headers->clearCookie('REMEMBERME', "/", ".".format_url(get_url(), FORMAT_URL_NOMACHINE|FORMAT_URL_NOSUBDOMAIN));

            return $response;
        }

        // Check if the session is found.. meaning, the user just logged out
        if ($request->getSession()?->has("_user")) {
            $user = $request->getSession()?->remove("_user");
            if ($user->isKicked()) {
                $notification = new Notification("kickout", [$user]);
                $notification->setUser($user);
                $notification->send("warning");
                $user->kick(0);
            } else {
                $notification = new Notification("logout.success", [$user]);
                $notification->send("info");
            }

            // Remove expired tokens
            $user->removeExpiredTokens();
        }

        // Redirect to previous page
        return $this->redirect($referrer->getUrl() ?? $this->router->getUrlIndex());
    }

    /**
     * @Route("/logout-request", name="security_logoutRequest")
     */
    public function LogoutRequest()
    {
        throw new Exception("This page should not be displayed.. Firewall should take over during logout process. Please check your configuration..");
    }

    /**
     * @Route("/register", name="security_register")
     */
    public function Register(Request $request, LoginFormAuthenticator $authenticator, UserAuthenticatorInterface $userAuthenticator, ParameterBagInterface $parameterBag): Response
    {
        // If already connected..
        if (($user = $this->getUser()) && $user->isPersistent()) {
            $notification = new Notification("login.already");
            $notification->send("warning");

            return $this->redirectToRoute('user_profile');
        }

        // Prepare registration form
        $formProcessor = $this->formProxy->createProcessor("form:login", SecurityRegistrationType::class, [
                'validation_groups' => ['new'],
                'validation_entity' => User::class
            ])
            ->onSubmit(function (FormProcessorInterface $formProcessor, Request $request) use ($userAuthenticator, $authenticator) {
                $newUser = $formProcessor->hydrate((new User()));

                // An account might require to be verified by an admin
                $adminApprovalRequired = !$this->parameterBag->get("base.user.register.autoapprove") ?? false;
                $newUser->approve(!$adminApprovalRequired);
                $newUser->setPlainPassword($formProcessor->getData("plainPassword"));

                // Social account connection
                if (($user = $this->getUser()) && $user->isVerified()) {
                    $newUser->verify($user->isVerified());
                }

                if ($newUser->isVerified() && $this->parameterBag->get("base.user.register.notify_admins")) {
                    $this->notifier->sendAdminsUserApprovalRequest($newUser);
                }

                $this->entityManager->persist($newUser);
                $this->entityManager->flush();

                $rememberMeBadge = new RememberMeBadge();
                $rememberMeBadge->enable();

                $userAuthenticator->authenticateUser($newUser, $authenticator, $request, [$rememberMeBadge]);
                return $this->redirectToRoute('user_profile');
            })

            ->onDefault(function (FormProcessorInterface $formProcessor) {
                return $this->render('security/register.html.twig', [
                    'form' => $formProcessor->getForm()->createView(),
                    'user' => $formProcessor->getData()
                ]);
            })

            ->handleRequest($request);

        return $formProcessor->getResponse();
    }

    /**
     * @Route("/verify-email", name="security_verifyEmail")
     * @IsGranted("ROLE_USER")
     */
    public function VerifyEmailRequest()
    {
        // Check if accound is already verified..
        $user = $this->getUser();
        if ($user->isVerified()) {
            $notification = new Notification("verifyEmail.already");
            $notification->send("info");
        } else {
            $verifyEmailToken = $user->getToken("verify-email");
            if ($verifyEmailToken && $verifyEmailToken->hasVeto()) {
                $notification = new Notification("verifyEmail.resend", [$verifyEmailToken->getThrottleTimeStr()]);
                $notification->send("danger");
            } else {
                $verifyEmailToken = new Token("verify-email", 24*3600, 3600);
                $verifyEmailToken->setUser($user);

                $notification = $this->notifier->sendVerificationEmail($user, $verifyEmailToken);
                $notification->send("success");
            }
        }

        $this->entityManager->flush();

        return $this->redirectToRoute('user_profile');
    }

    /**
     * @Route("/verify-email/{token}", name="security_verifyEmailWithToken")
     */
    public function VerifyEmailResponse(Request $request, UserAuthenticatorInterface $userAuthenticator, LoginFormAuthenticator $authenticator, string $token): Response
    {
        $token = $this->tokenRepository->findOneByValueAndName($token, "verify-email");
        if ($token) {
            $userAuthenticator->authenticateUser($token->getUser(), $authenticator, $request);
        }

        $user = $this->getUser();
        $user->removeExpiredTokens("verify-email");

        if ($user->isVerified()) {
            $notification = new Notification('verifyEmail.already');
            $notification->setUser($user);
            $notification->send('info');
        } else {
            $verifyEmailToken = $user->getValidToken("verify-email");

            if ($verifyEmailToken === null || $verifyEmailToken->get() != $token->get()) {
                $notification = new Notification("verifyEmail.invalidToken");
                $notification->setUser($user);
                $notification->send("danger");
            } else {
                $user->verify(true);
                $verifyEmailToken->revoke();

                $notification = new Notification("verifyEmail.success");
                $notification->setUser($user);
                $notification->send('success');

                if (!$user->isApproved()) { // If the account needs further validation by admin..
                    $this->AdminApprovalRequest($request);
                }
            }
        }

        $this->entityManager->flush();
        return $this->redirectToRoute('user_profile');
    }

    /**
     * @Route("/admin-approval", name="security_adminApproval")
     */
    public function AdminApprovalRequest(Request $request)
    {
        $user = $this->getUser();
        $user->removeExpiredTokens("admin-approval");

        if (!$user->isVerified()) {
            $notification = new Notification("adminApproval.verifyFirst");
            $notification->send("warning");
        } elseif (!$user->isApproved()) {
            if (($adminApprovalToken = $user->getValidToken("admin-approval"))) {
                $notification = new Notification("adminApproval.alreadySent");
                $notification->send("warning");
            } else {
                $adminApprovalToken = new Token("admin-approval");
                $adminApprovalToken->setUser($user);

                $notification = $this->notifier->sendAdminsUserApprovalRequest($user);
                $notification->send("success");
            }
        }

        $this->entityManager->flush();
        return $this->redirectToRoute('user_profile');
    }

    /**
     * @Route("/account-goodbye", name="security_accountGoodbye")
     */
    public function DisableAccountRequest(Request $request)
    {
        $user = $this->getUser();

        if ($user->isDisabled()) {
            $notification = new Notification("accountGoodbye.already");
            $notification->send("warning");

            return $this->redirectToRoute($this->router->getRouteIndex());
        } else {
            $user->disable();
            $user->logout();

            $this->entityManager->flush();
            return $this->redirectToRoute($this->router->getRouteIndex());
        }
    }

    /**
     * @Route("/welcome-back/{token}", name="security_accountWelcomeBackWithToken")
     */
    public function EnableAccountRequest(Request $request, LoginFormAuthenticator $authenticator, UserAuthenticatorInterface $userAuthenticator, string $token = null): Response
    {
        $welcomeBackToken = $this->tokenRepository->findOneByValueAndName($token, "welcome-back");
        $user = $welcomeBackToken ? $welcomeBackToken->getUser() : $this->getUser();

        if ($user && !$user->isDisabled()) {
            $welcomeBackToken->revoke();

            $notification = new Notification("accountWelcomeBack.already");
            $notification->send("warning");
        } elseif ($user && $user->getValidToken("welcome-back")) {
            $user->enable();
            $authenticateUser = $userAuthenticator->authenticateUser($user, $authenticator, $request);

            $this->entityManager->flush();
            return $authenticateUser;
        } else {
            if ($welcomeBackToken) {
                $welcomeBackToken->revoke();
            }

            $notification = new Notification("accountWelcomeBack.invalidToken");
            $notification->send("danger");

            $this->entityManager->flush();
        }

        return $this->redirectToRoute($this->router->getRouteIndex());
    }

    /**
     * Display & process form to request a password reset.
     *
     * @Route("/reset-password", name="security_resetPassword")
     */
    public function ResetPasswordRequest(Request $request): Response
    {
        if (($user = $this->getUser()) && $user->isPersistent()) {
            $notification = new Notification("login.already");
            $notification->send("warning");

            return $this->redirectToRoute('user_profile');
        }

        $form = $this->createForm(SecurityResetPasswordType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $notification = new Notification("resetPassword.confirmation");

            $email = $username = $form->get('email')->getData();
            if (($user = $this->userRepository->findOneByUsernameOrEmail($email, $username))) {
                $user->removeExpiredTokens("reset-password");
                if (!$user->getToken("reset-password")) {
                    $resetPasswordToken = new Token("reset-password", 3600);
                    $resetPasswordToken->setUser($user);

                    $this->notifier->sendResetPasswordRequest($user, $resetPasswordToken);
                }
            }

            $this->entityManager->flush();
            $notification->send("success");
        }

        return $this->render('security/reset_password_request.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * Validates and process the reset URL that the user clicked in their email.
     *
     * @Route("/reset-password/{token}", name="security_resetPasswordWithToken")
     */
    public function ResetPasswordResponse(Request $request, LoginFormAuthenticator $authenticator, UserAuthenticatorInterface $userAuthenticator, string $token = null): Response
    {
        if (($user = $this->getUser()) && $user->isPersistent()) {
            $notification = new Notification("login.already");
            $notification->send("warning");

            return $this->redirectToRoute('user_profile');
        }

        $resetPasswordToken = $this->tokenRepository->findOneByValue($token);
        if (!$resetPasswordToken) {
            $notification = new Notification("resetPassword.invalidToken");
            $notification->send("danger");

            return $this->redirectToRoute($this->router->getRouteIndex());
        } else {
            $user = $resetPasswordToken->getUser();

            // The token is valid; allow the user to change their password.
            $form = $this->createForm(SecurityResetPasswordConfirmType::class);
            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {
                $resetPasswordToken->revoke();
                $user->setPlainPassword($form->get('plainPassword')->getData());

                $notification = new Notification("resetPassword.success");

                $this->entityManager->flush();

                $rememberMeBadge = new RememberMeBadge();
                $rememberMeBadge->enable();

                $userAuthenticator->authenticateUser($newUser, $authenticator, $request, [$rememberMeBadge]);
                $notification->send("success");

                return $authenticateUser;
            }

            return $this->render('security/reset_password.html.twig', ['form' => $form->createView()]);
        }
    }

    /**
     * Link to this controller to start the maintenance
     *
     * @Route("/m", name="security_maintenance")
     */
    public function Maintenance(MaintenanceProviderInterface $maintenanceProvider): Response
    {
        return $this->render('security/maintenance.html.twig', [
            'remainingTime' => $maintenanceProvider->getRemainingTime(),
            'percentage'    => $maintenanceProvider->getPercentage(),
            'downtime'      => $maintenanceProvider->getDowntime(),
            'uptime'        => $maintenanceProvider->getUptime()
        ]);
    }


    /**
     * Link to this controller to start the birth
     *
     * @Route({"fr": "/est/bientot/en/ligne", "en":"/is/coming/soon"}, name="security_birth")
     */
    public function Birth(MaternityUnitInterface $maternityUnit): Response
    {
        return $this->render('security/birthdate.html.twig', [
            'birthdate'  => $maternityUnit->getBirthdate(),
            'is_born'    => $maternityUnit->isBorn()
        ]);
    }

    /**
     * @Route({"fr": "/est/bientot/disponible", "en": "/is/soon/available"}, name="security_pending")
     */
    public function Pending(): Response
    {
        return $this->render('security/pending.html.twig');
    }

    /**
     * @Route({"fr": "/en/attente/de/validation", "en": "/waiting/for/approval"}, name="security_pendingForApproval")
     * @IsGranted("ROLE_USER")
     */
    public function PendingForApproval(): Response
    {
        if ($this->getUser()->isApproved()) {
            return $this->redirectToRoute("app_index");
        }
        return $this->render('security/pendingForApproval.html.twig');
    }
}
