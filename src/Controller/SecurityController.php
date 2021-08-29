<?php

namespace Base\Controller;

use App\Entity\User;

use Base\Entity\User\Notification;
use Base\Service\BaseService;
use Base\Security\LoginFormAuthenticator;

use App\Form\Type\Security\RegistrationType;
use App\Form\Type\Security\LoginType;
use App\Form\Type\Security\ChangePasswordType;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;

use Symfony\Component\Notifier\NotifierInterface;

use Base\Entity\User\Token;
use Base\Form\Type\Security\ResetPasswordType;
use App\Repository\UserRepository;
use Base\Database\Annotation\Hashify;
use Base\Form\Type\Security\ResetPasswordConfirmType;
use Base\Repository\User\TokenRepository;
use Symfony\Component\PasswordHasher\Hasher\PasswordHasherFactory;

class SecurityController extends AbstractController
{
    protected $baseService;

    public function __construct(BaseService $baseService, UserRepository $userRepository, TokenRepository $tokenRepository)
    {
        $this->baseService = $baseService;
        $this->userRepository = $userRepository;
        $this->tokenRepository = $tokenRepository;
    }

    /**
     * @Route("/clean/security", name="base_clean_security")
     */
    public function Clean()
    {
        //TODO.. Perhaps commands
        throw new Exception("Clean UserLog not implemented yet");
    }

    /**
     * @Route("/login", name="base_login")
     */
    public function Login(Request $request, AuthenticationUtils $authenticationUtils): Response
    {
        // In case of maintenance, still allow users to login
        if($this->baseService->isMaintenance()) {

            if ( ($user = $this->getUser()) && $user->isLegit() )
            return $this->redirectToRoute("base_dashboard");

            $error = $authenticationUtils->getLastAuthenticationError();
            $lastUsername = $authenticationUtils->getLastUsername();

            $logo = $this->baseService->getParameterBag("base.logo");
            return $this->render('@EasyAdmin/page/login.html.twig', [
                'error' => $error,
                'last_username' => $lastUsername,
                'translation_domain' => 'admin',
                'csrf_token_intention' => 'authenticate',
                'target_path' => $this->baseService->getRoute('base_dashboard'),
                'username_label' => 'Your username',
                'password_label' => 'Your password',
                'sign_in_label' => 'Log in',
                'page_title' => '<img src="'.$logo.'" alt="Dashboard">'
            ]);
        }

        // Redirect to the right page when access denied
        if ( ($user = $this->getUser()) && $user->isLegit() ) {

            if ($this->isGranted('IS_AUTHENTICATED_FULLY')) {

                // Redirect to previous page
                $targetPath =
                    $request->getSession()->get('_security.main.target_path') ??
                    $request->getSession()->get('_security.account.target_path') ??
                    $request->headers->get('referer') ?? null;

                $targetRoute = (basename($targetPath) ? $this->baseService->getRouteName("/".basename($targetPath)) : null) ?? null;
                if ($targetRoute && $targetRoute != LoginFormAuthenticator::LOGIN_ROUTE && $targetRoute != LoginFormAuthenticator::LOGOUT_ROUTE)
                    return $this->redirectToRoute($targetRoute);

                return $this->redirectToRoute("base_profile");
            }

            $notification = new Notification("notifications.login.partial");
            $notification->send("info");
        }

        // Get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        if($error) {
            $notification = new Notification($error->getMessage());
            $notification->send("warning");
        }

        // Last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        // Generate form
        $user = new User();
        $form = $this->createForm(LoginType::class, $user, ["username" => $lastUsername]);
        $form->handleRequest($request);

        // Remove expired tokens
        $user->removeExpiredTokens();

        return $this->render('@Base/security/login.html.twig', [
            "username" => $lastUsername,
            "form" => $form->createView()
        ]);
    }

    /**
     * @Route("/logout", name="base_logout")
     */
    public function Logout() {

        // If user is found.. go to the logout request page
        if($this->getUser())
            return $this->redirectToRoute('base_logout_request');

        // Check if the session is found.. meaning, the user just logged out
        if($user = $this->baseService->removeSession("_user")) {

            $message = "";
            if (method_exists(User::class, "getUsername")) {
                $username = $user->getUsername();
                $message = "Bye bye $username !";
            }

            $notification = new Notification("notifications.logout.success", [$message]);
            $notification->send("success");

            // Remove expired tokens
            $user->removeExpiredTokens();
            
            // Redirect to previous page
            $targetPath = $this->baseService->getRequest()->headers->get('referer') ?? null;
            if ($targetPath) return $this->redirect($targetPath);

        }

        return $this->redirectToRoute('base_homepage');
    }

    /**
     * @Route("/logout-request", name="base_logout_request")
     */
    public function LogoutRequest()
    {
        throw new Exception("This page should not be displayed.. Firewall should take over during logout process. Please check your configuration..");
    }

    /**
     * @Route("/register", name="base_register")
     */
    public function Register(Request $request, LoginFormAuthenticator $authenticator, UserAuthenticatorInterface $userAuthenticator): Response {

        // If already connected..
        if (($user = $this->getUser()) && $user->isLegit())
            return $this->redirectToRoute('base_profile');

        // Prepare registration form
        $newUser = new User();
        $form = $this->createForm(
            RegistrationType::class,
            $newUser,
            ['validation_groups' => ['new']]
        );

        // An account might require to be verified by an admin
        $adminApprovalRequired = $this->baseService->getParameterBag("base_security.user.adminApproval") ?? false;
        $newUser->approve(!$adminApprovalRequired);

        $form->handleRequest($request);

        // Registration form registered
        if ($form->isSubmitted() && $form->isValid()) {

            if ($this->baseService->isCsrfTokenValid('registration', $form, $request)) {
        
                $notification = new Notification("notification.register.csrfToken");
                $notification->send("danger");
                
            } else {
            
                $newUser->setPlainPassword($form->get('plainPassword')->getData());
                if ($user && $user->isVerified()) // Social account connection
                    $newUser->verify($user->isVerified());

                $entityManager = $this->getDoctrine()->getManager();
                $entityManager->persist($newUser);
                $entityManager->flush();

                return $userAuthenticator->authenticateUser($newUser, $authenticator, $request);
            }
        }

        // Retrieve form if no social account connected
        if (!$user) $user = $newUser;

        return $this->render('@Base/security/register.html.twig', [
            'form' => $form->createView(),
            'user' => $user
        ]);
    }

    /**
     * @Route("/verify-email", name="base_register_email")
     * @IsGranted("ROLE_USER")
     */
    public function VerifyEmailRequest(Request $request, NotifierInterface $notifier)
    {
        // Check if accound is already verified..
        $user = $this->getUser();
        if ($user->isVerified()) {

            $notification = new Notification("notifications.verifyEmail.already");
            $notification->send("success");

        } else if ( ($verifyEmailToken = $user->getValidToken("verify-email")) ) {

            $notification = new Notification("notifications.verifyEmail.resend", [$verifyEmailToken->getRemainingTimeStr()]);
            $notification->send("danger");

        } else {

            $verifyEmailToken = new Token("verify-email", 24*3600);
            $verifyEmailToken->setUser($user);

            $notification = new Notification('notifications.verifyEmail.check');
            $notification->setUser($user);
            $notification->setHtmlTemplate("@Base/security/email/verify_email.html.twig", ["token" => $verifyEmailToken]);
            $notification->send("success")->send("urgent");
        }

        $this->getDoctrine()->getManager()->flush();
        return $this->redirectToRoute('base_profile');
    }

    /**
     * @Route("/verify-email/{token}", name="base_verify_email")
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function VerifyEmailResponse(Request $request): Response
    {
        $user = $this->getUser();
        $user->removeExpiredTokens("verify-email");

        if ($user->isVerified()) {

            $notification = new Notification('notifications.verifyEmail.already');
            $notification->setUser($user);
            $notification->send('warning');

        } else if (!($verifyEmailToken = $user->getValidToken("verify-email"))) {

            $notification = new Notification("notifications.verifyEmail.invalidToken");
            $notification->send("danger");

        } else {

            $user->setIsVerified(true);
            $verifyEmailToken->revoke();

            $notification = new Notification("notifications.verifyEmail.success");
            $notification->setUser($user);
            $notification->send('success');

            if (!$user->isApproved()) // If the account needs further validation by admin..
                $this->AdminApprovalRequest($request);
        }

        $this->userRepository->flush();
        return $this->redirectToRoute('base_profile');
    }

    /**
     * @Route("/admin-approval", name="base_adminApproval")
     */
    public function AdminApprovalRequest(Request $request)
    {
        $user = $this->getUser();
        $user->removeExpiredTokens("admin-approval");

        if(!$user->isVerified()) {

            $notification = new Notification("notifications.adminApproval.verifyFirst");  
            $notification->send("warning");

        } else if (!$user->isApproved()) {

            if ( ($adminApprovalToken = $user->getValidToken("admin-approval")) ) { 

                $notification = new Notification("notifications.adminApproval.alreadySent");  
                $notification->send("warning");

            } else {

                $adminApprovalToken = new Token("admin-approval");
                $adminApprovalToken->setUser($user);
            
                $notification = new Notification("notifications.adminApproval.required");
                $notification->setUser($user);
                $notification->setHtmlTemplate("@Base/security/email/admin_approval.html.twig",["token" => $adminApprovalToken]);
                $notification->sendAdmins("low")->send("success");
            }
        }

        $this->getDoctrine()->getManager()->flush();
        return $this->redirectToRoute('base_profile');
    }

    /**
     * Display & process form to request a password reset.
     *
     * @Route("/reset-password", name="base_reset_password")
     */
    public function ResetPasswordRequest(Request $request): Response
    {
        if (($user = $this->getUser()) && $user->isLegit())
            return $this->redirectToRoute('base_profile');
            
        $form = $this->createForm(ResetPasswordType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            if (!$this->baseService->isCsrfTokenValid('reset-password', $form, $request)) {

                $notification = new Notification("notification.resetPassword.csrfToken");
                $notification->send("danger");
                
            } else {

                $notification = new Notification("notifications.resetPassword.confirmation");

                $email = $username = $form->get('email')->getData();
                if( ($user = $this->userRepository->findOneByUsernameOrEmail($email, $username)) ) {

                    $user->removeExpiredTokens("reset-password");
                    if (!$user->getToken("reset-password")) {

                        $resetPasswordToken = new Token("reset-password", 3600);
                        $resetPasswordToken->setUser($user);

                        $notification->setHtmlTemplate("@Base/security/email/reset_password_request.html.twig", ["token" => $resetPasswordToken]);
                        $notification->setUser($user);
                        $notification->send("urgent");
                    }
                }

                $this->getDoctrine()->getManager()->flush();
                $notification->send("success");
            }
        }

        return $this->render('@Base/security/reset_password_request.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * Validates and process the reset URL that the user clicked in their email.
     *
     * @Route("/reset-password/{token}", name="base_reset_password_token")
     */
    public function ResetPasswordResponse(Request $request, LoginFormAuthenticator $authenticator, UserAuthenticatorInterface $userAuthenticator, string $token = null): Response
    {
        $resetPasswordToken = $this->tokenRepository->findOneByValue($token);
        if (!$resetPasswordToken) {

            $notification = new Notification("notifications.resetPassword.invalidToken");
            $notification->send("danger");

            return $this->redirectToRoute('base_homepage');

        } else {

            $user = $resetPasswordToken->getUser();

            // The token is valid; allow the user to change their password.
            $form = $this->createForm(ResetPasswordConfirmType::class);
            $form->handleRequest($request);
        
            if ($form->isSubmitted() && $form->isValid()) {

                if($resetPasswordToken) $user->removeToken($resetPasswordToken);
                $user->setPlainPassword($form->get('plainPassword')->getData());

                $notification = new Notification("notifications.resetPassword.success");
                $notification->send("success");

                $this->getDoctrine()->getManager()->flush();
                return $userAuthenticator->authenticateUser($user, $authenticator, $request);
            }

            return $this->render('@Base/security/reset_password.html.twig', [
                'form' => $form->createView(),
            ]);
        }

    }
}
