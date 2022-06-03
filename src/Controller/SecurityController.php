<?php

namespace Base\Controller;

use App\Entity\User;

use Base\Entity\User\Notification;
use Base\Service\BaseService;
use Base\Security\LoginFormAuthenticator;

use App\Form\Type\Security\RegistrationType;
use App\Form\Type\Security\LoginType;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;

use Symfony\Component\Notifier\NotifierInterface;

use Base\Entity\User\Token;
use Base\Form\Type\Security\ResetPasswordType;
use App\Repository\UserRepository;
use Base\Annotations\Annotation\Iconize;
use Base\Component\HttpFoundation\Referrer;
use Base\Form\Type\Security\ResetPasswordConfirmType;
use Base\Repository\User\TokenRepository;
use Base\Service\ParameterBagInterface;
use Doctrine\ORM\EntityManager;

class SecurityController extends AbstractController
{
    protected $baseService;

    public function __construct(EntityManager $entityManager, UserRepository $userRepository, TokenRepository $tokenRepository, BaseService $baseService)
    {
        $this->baseService = $baseService;
        $this->userRepository = $userRepository;
        $this->tokenRepository = $tokenRepository;
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/login", name="security_login")
     * @Iconize("fas fa-fw fa-sign-in-alt")
     */
    public function Login(Request $request, Referrer $referrer, AuthenticationUtils $authenticationUtils): Response
    {
        // In case of maintenance, still allow users to login
        if($this->baseService->isMaintenance())
            return $this->redirectToRoute("dashboard_login");

        // Last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        $targetPath = strval($referrer);
        $targetRoute = $this->baseService->getRouteName($targetPath);

        // Redirect to the right page when access denied
        if ( ($user = $this->getUser()) && $user->isPersistent() ) {

            if ($this->isGranted('IS_AUTHENTICATED_FULLY')) {

                // Check if target path provided via $_POST..
                $targetPath = strval($referrer);
                $targetRoute = $this->baseService->getRouteName($targetPath);
                if ($targetPath && !in_array($targetRoute, [LoginFormAuthenticator::LOGOUT_ROUTE, LoginFormAuthenticator::LOGIN_ROUTE]) )
                    return $this->baseService->redirect($targetPath);

                return $this->redirectToRoute($request->isMethod('POST') ? "user_settings" : $this->baseService->getRouteName("/"));
            }

            $notification = new Notification("login.partial");
            $notification->send("info");
        }

        // Generate form
        $user = new User();
        $form = $this->createForm(LoginType::class, $user, ["identifier" => $lastUsername]);
        $form->handleRequest($request);

        // Remove expired tokens
        $user->removeExpiredTokens();

        return $this->render('@Base/security/login.html.twig', [
            "identifier" => $lastUsername,
            "form" => $form->createView()
        ]);
    }

    /**
     * @Route("/logout", name="security_logout")
     * @Iconize("fas fa-fw fa-sign-out-alt")
     */
    public function Logout(Referrer $referrer, Request $request) {

        // If user is found.. go to the logout request page
        if($this->getUser())
            return $this->redirectToRoute('security_logoutRequest');

        // Check if the session is found.. meaning, the user just logged out
        if($user = $this->baseService->removeSession("_user")) {

            $message = "Bye bye $user !";

            if( $user->isKicked()   ) {

                $notification = new Notification("kickout", [$user]);
                $notification->setUser($user);
                $notification->send("warning");
                $user->kick(0);

            } else {

                $notification = new Notification("logout.success", [$message]);
                $notification->send("info");
            }

            // Remove expired tokens
            $user->removeExpiredTokens();
        }

        // Redirect to previous page
        return $this->redirect($referrer->getUrl() ?? $this->baseService->getAsset("/"));
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
    public function Register(Request $request, LoginFormAuthenticator $authenticator, UserAuthenticatorInterface $userAuthenticator, ParameterBagInterface $parameterBag): Response {

        // If already connected..
        if (($user = $this->getUser()) && $user->isPersistent())
            return $this->redirectToRoute('user_profile');

        // Prepare registration form
        $newUser = new User();
        $form = $this->createForm(RegistrationType::class, $newUser, ['validation_groups' => ['new']]);

        // An account might require to be verified by an admin
        $adminApprovalRequired = $parameterBag->get("security.user.adminApproval") ?? false;
        $newUser->approve(!$adminApprovalRequired);

        $form->handleRequest($request);

        // Registration form registered
        if ($form->isSubmitted() && $form->isValid()) {

            $newUser->setPlainPassword($form->get('plainPassword')->getData());
            if ($user && $user->isVerified()) // Social account connection
                $newUser->verify($user->isVerified());

            $this->entityManager->persist($newUser);
            $this->entityManager->flush();

            return $userAuthenticator->authenticateUser($newUser, $authenticator, $request);
        }

        // Retrieve form if no social account connected
        if (!$user) $user = $newUser;

        return $this->render('@Base/security/register.html.twig', [
            'form' => $form->createView(),
            'user' => $user
        ]);
    }

    /**
     * @Route("/verify-email", name="security_verifyEmail")
     * @IsGranted("ROLE_USER")
     */
    public function VerifyEmailRequest(Request $request, NotifierInterface $notifier)
    {
        // Check if accound is already verified..
        $user = $this->getUser();
        if ($user->isVerified()) {

            $notification = new Notification("verifyEmail.already");
            $notification->send("info");

        } else {

            $verifyEmailToken = $user->getToken("verify-email");
            if($verifyEmailToken && $verifyEmailToken->hasVeto()) {

                $notification = new Notification("verifyEmail.resend", [$verifyEmailToken->getDeadtimeStr()]);
                $notification->send("danger");

            } else {

                $verifyEmailToken = new Token("verify-email", 24*3600);
                $verifyEmailToken->setUser($user);

                $notification = new Notification('verifyEmail.check');
                $notification->setUser($user);
                $notification->setHtmlTemplate("@Base/security/email/verify_email.html.twig", ["token" => $verifyEmailToken]);
                $notification->send("success")->send("urgent");
            }
        }

        $this->entityManager->flush();
        return $this->redirectToRoute('user_profile');
    }

    /**
     * @Route("/verify-email/{token}", name="security_verifyEmailWithToken")
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function VerifyEmailResponse(Request $request, string $token): Response
    {
        $user = $this->getUser();
        $user->removeExpiredTokens("verify-email");

        if ($user->isVerified()) {

            $notification = new Notification('verifyEmail.already');
            $notification->setUser($user);
            $notification->send('info');

        } else {

            $verifyEmailToken = $user->getValidToken("verify-email");
            if (!$verifyEmailToken || $verifyEmailToken->get() != $token) {

                $notification = new Notification("verifyEmail.invalidToken");
                $notification->setUser($user);
                $notification->send("danger");

            } else {

                $user->verify(true);
                $verifyEmailToken->revoke();

                $notification = new Notification("verifyEmail.success");
                $notification->setUser($user);
                $notification->send('success');

                if (!$user->isApproved()) // If the account needs further validation by admin..
                    $this->AdminApprovalRequest($request);
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

        if(!$user->isVerified()) {

            $notification = new Notification("adminApproval.verifyFirst");
            $notification->send("warning");

        } else if (!$user->isApproved()) {

            if ( ($adminApprovalToken = $user->getValidToken("admin-approval")) ) {

                $notification = new Notification("adminApproval.alreadySent");
                $notification->send("warning");

            } else {

                $adminApprovalToken = new Token("admin-approval");
                $adminApprovalToken->setUser($user);

                $notification = new Notification("adminApproval.required");
                $notification->setUser($user);
                $notification->setHtmlTemplate("@Base/security/email/admin_approval.html.twig",["token" => $adminApprovalToken]);
                $notification->sendAdmins("low")->send("success");
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

        if($user->isDisabled()) {

            $notification = new Notification("accountGoodbye.already");
            $notification->send("warning");

            return $this->redirectToRoute($this->baseService->getRouteName("/"));

        } else {

            $user->disable();

            $this->baseService->Logout();

            $this->entityManager->flush();
            return $this->redirectToRoute($this->baseService->getRouteName("/"));
        }
    }

    /**
     * @Route("/welcome-back/{token}", name="security_accountWelcomeBackWithToken")
     */
    public function EnableAccountRequest(Request $request, LoginFormAuthenticator $authenticator, UserAuthenticatorInterface $userAuthenticator, string $token = null): Response
    {
        $welcomeBackToken = $this->tokenRepository->findOneByValueAndName($token, "welcome-back");
        $user = $welcomeBackToken ? $welcomeBackToken->getUser() : $this->getUser();

        if($user && !$user->isDisabled()) {

            $welcomeBackToken->revoke();

            $notification = new Notification("accountWelcomeBack.already");
            $notification->send("warning");

        } else if ($user && $user->getValidToken("welcome-back")){

            $user->enable();
            $authenticateUser = $userAuthenticator->authenticateUser($user, $authenticator, $request);

            $this->entityManager->flush();
            return $authenticateUser;

        } else {

            if ($welcomeBackToken) {

                $welcomeBackToken->revoke();
                $this->entityManager->flush();
            }

            $notification = new Notification("accountWelcomeBack.invalidToken");
            $notification->send("danger");
        }

        return $this->redirectToRoute($this->baseService->getRouteName("/"));
    }

    /**
     * Display & process form to request a password reset.
     *
     * @Route("/reset-password", name="security_resetPassword")
     */
    public function ResetPasswordRequest(Request $request): Response
    {
        if (($user = $this->getUser()) && $user->isPersistent())
            return $this->redirectToRoute('user_profile');

        $form = $this->createForm(ResetPasswordType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $notification = new Notification("resetPassword.confirmation");

            $email = $username = $form->get('email')->getData();
            if( ($user = $this->userRepository->findOneByUsernameOrEmail($email, $username)) ) {

                $user->removeExpiredTokens("reset-password");
                if (!$user->getToken("reset-password")) {

                    $resetPasswordToken = new Token("reset-password", 3600);
                    $resetPasswordToken->setUser($user);

                    $notification->setHtmlTemplate("@Base/security/email/reset_password.html.twig", ["token" => $resetPasswordToken]);
                    $notification->setUser($user);
                    $notification->send("email");
                }
            }

            $this->entityManager->flush();
            $notification->send("success");
        }

        return $this->render('@Base/security/reset_password_request.html.twig', [
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
        if (($user = $this->getUser()) && $user->isPersistent())
            return $this->redirectToRoute('user_profile');

        $resetPasswordToken = $this->tokenRepository->findOneByValue($token);
        if (!$resetPasswordToken) {

            $notification = new Notification("resetPassword.invalidToken");
            $notification->send("danger");

            return $this->redirectToRoute($this->baseService->getRouteName("/"));

        } else {

            $user = $resetPasswordToken->getUser();

            // The token is valid; allow the user to change their password.
            $form = $this->createForm(ResetPasswordConfirmType::class);
            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {

                $resetPasswordToken->revoke();
                $user->setPlainPassword($form->get('plainPassword')->getData());

                $notification = new Notification("resetPassword.success");

                $this->entityManager->flush();
                $authenticateUser = $userAuthenticator->authenticateUser($user, $authenticator, $request);
                $notification->send("success");

                return $authenticateUser;
            }

            return $this->render('@Base/security/reset_password.html.twig', ['form' => $form->createView()]);
        }
    }

    /**
     * Link to this controller to start the maintenance
     *
     * @Route("/m", name="security_maintenance")
     */
    public function Main(): Response
    {
        $downtime = $uptime = 0;

        $fname = $this->baseService->getParameterBag("base.maintenance.lockpath");
        if ( ($f = @fopen($fname, "r")) ) {

            $downtime = trim(fgets($f, 4096));
            if(!feof($f)) $uptime = trim(fgets($f, 4096));

            fclose($f);

        } else {

            $downtime = $this->baseService->getSettingBag()->get("base.settings.maintenance_downtime")["_self"] ?? null;
            $uptime   = $this->baseService->getSettingBag()->get("base.settings.maintenance_uptime")["_self"] ?? null;
        }

        $downtime = $downtime ? strtotime($downtime) : 0;
        $uptime = $uptime ? strtotime($uptime) : 0;

        $remainingTime = $uptime - time();
        if ($downtime-time() > 0 || $downtime < 1) $downtime = 0;
        if (  $uptime-time() < 0 || $uptime < 1) $uptime = 0;

        if( !$downtime || ($uptime-$downtime <= 0) || ($uptime-time() <= 0) ) $percentage = -1;
        else $percentage = round(100 * (time()-$downtime)/($uptime-$downtime));

        return $this->render('@Base/security/maintenance.html.twig', [
            'remainingTime' => $remainingTime,
            'percentage' => $percentage,
            'downtime'   => $downtime,
            'uptime'     => $uptime
        ]);
    }
}
