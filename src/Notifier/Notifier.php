<?php

namespace Base\Notifier;

use App\Entity\User;
use Base\Entity\User\Notification;
use Base\Entity\User\Token;
use Base\Form\Model\ContactModel;
use Base\Notifier\Abstract\BaseNotifier;
use Base\Notifier\Recipient\Recipient;
use Symfony\Component\Routing\Router;

/**
 *
 */
class Notifier extends BaseNotifier implements NotifierInterface
{
    public function testEmail(?User $user): Notification
    {
        $notification = new Notification("email.html.twig");
        $notification->setUser($user);

        $url = null;
        if (!str_ends_with($this->router->getRouteName(), "_send")) {
            $url = $this->router->generate($this->router->getRouteName() . "_send");
        }

        $notification->setContext([
            "importance" => "high",
            "markdown" => false,
            "exception" => null,

            "subject" => $_GET["subject"] ?? $this->translator->trans('@emails.itWorks'),

            "excerpt" => $_GET["excerpt"] ??
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Proin blandit et lorem sed bibendum.
                    Nam eu urna placerat, rhoncus nulla id, mollis nisi.",

            "action_url" => $url,
            "action_text" => "Send email",

            "content" => $_GET["content"] ?? "<b>ABC.</b> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Proin blandit et lorem sed bibendum.
                    Nam eu urna placerat, rhoncus nulla id, mollis nisi.
                    Nullam id elit sed ligula auctor egestas.
                    Vivamus tincidunt auctor mattis.
                    Sed turpis dui, laoreet non consequat eget, fermentum a neque.
                    Donec non aliquam arcu, nec dictum massa.
                    Aliquam dignissim nisl eu libero ultrices mattis.
                    Fusce aliquet sed quam id ultricies.
                    Duis at neque elementum, convallis orci et, scelerisque dolor.
                    Vivamus sit amet metus in velit imperdiet bibendum.
                    Pellentesque pretium dui ac justo elementum blandit.
                    Donec nibh erat, maximus in condimentum ac, condimentum eget lorem.
                    Sed hendrerit maximus ante, eu euismod purus tempor vel.",
            "footer_text" => $this->translator->trans('@emails.returnIndex', [$this->router->generate("/", [], Router::ABSOLUTE_URL)]) ?? null
        ]);

        return $notification;
    }

    /**
     * @param ContactModel $contactModel
     * @return Notification
     */
    public function contactEmail(ContactModel $contactModel)
    {
        $notification = new Notification("contact.adminNotification");
        $notification->setHtmlTemplate("email.html.twig");

        $name = $this->settingBag->getScalar("base.settings.mail.name");
        $email = $this->settingBag->getScalar("base.settings.mail.contact");

        $adminRecipient = new Recipient(mailformat([], $name, $email));

        $notification->addRecipient($adminRecipient);
        $notification->setHtmlParameters([

            "importance" => "high",
            "replyTo" => $contactModel->getRecipient(),
            "subject" => $this->translator->trans("@emails.contact.subject"),
            "excerpt" => $this->translator->trans("@emails.contact.excerpt", [$contactModel->name]),
            "content" => $this->translator->trans("@emails.contact.content", [$contactModel->subject, $contactModel->message]),
        ]);

        return $notification;
    }

    /**
     * @param ContactModel $contactModel
     * @return Notification
     */
    public function contactEmailConfirmation(ContactModel $contactModel)
    {
        $notification = new Notification("contact.userConfirmation");
        $notification->setHtmlTemplate("email.html.twig");
        $notification->addRecipient($contactModel->getRecipient());

        $notification->setHtmlParameters([
            "subject" => $this->translator->trans("@emails.contact_confirmation.subject", [$contactModel->name]),
            "excerpt" => $this->translator->trans("@emails.contact_confirmation.excerpt"),
            "content" => $this->translator->trans("@emails.contact_confirmation.content", [$contactModel->subject, $contactModel->message]),
        ]);

        return $notification;
    }

    /**
     * @param User $user
     * @return Notification
     */
    public function userAccountGoodbye(User $user)
    {
        $notification = new Notification("accountGoodbye.success");
        $notification->setUser($user);

        $notification->setHtmlTemplate("email.html.twig");
        $notification->setHtmlParameters([
            "subject" => $this->translator->trans("@emails.accountGoodbye.subject", [$user]),
            "content" => $this->translator->trans("@emails.accountGoodbye.content"),
            "action_text" => $this->translator->trans("@emails.accountGoodbye.action_text"),
            "action_url" => $this->router->getUrl("security_login")
        ]);

        return $notification;
    }

    /**
     * @param User $user
     * @return Notification
     */
    public function userApprovalRequest(User $user)
    {
        $notification = new Notification("adminApproval.required");
        $notification->setUser($user);

        $notification->setHtmlTemplate("email.html.twig");
        $notification->setHtmlParameters([
            "subject" => $this->translator->trans("@emails.adminApproval.subject", [$user]),
            "content" => $this->translator->trans("@emails.adminApproval.content", [$user, $user->getId()]),
            "action_text" => $this->translator->trans("@emails.adminApproval.action_text"),
            "action_url" => $this->router->getUrl("backoffice")
        ]);

        return $notification;
    }

    /**
     * @param User $user
     * @return Notification
     */
    public function userApprovalConfirmation(User $user)
    {
        $notification = new Notification("adminApproval.approval");
        $notification->setUser($user);

        $notification->setHtmlTemplate("email.html.twig");
        $notification->setHtmlParameters([
            "subject" => $this->translator->trans("@emails.adminApprovalConfirm.subject"),
            "content" => $this->translator->trans("@emails.adminApprovalConfirm.content", [$user]),
            "action_text" => $this->translator->trans("@emails.adminApprovalConfirm.action_text"),
            "action_url" => $this->router->getUrl("security_login")
        ]);

        return $notification;
    }

    /**
     * @param User $user
     * @param Token $token
     * @return Notification
     */
    public function resetPasswordRequest(User $user, Token $token)
    {
        $notification = new Notification("resetPassword.success");
        $notification->setUser($user);

        $notification->setHtmlTemplate("email.html.twig");
        $notification->setHtmlParameters([
            "subject" => $this->translator->trans("@emails.resetPassword.subject"),
            "content" => $this->translator->trans("@emails.resetPassword.content"),
            "action_text" => $this->translator->trans("@emails.resetPassword.action_text"),
            "action_url" => $this->router->getUrl("security_resetPasswordWithToken", ["token" => $token->get()])
        ]);

        if ($token->getLifetime() > 0 && $token->getLifetime() < 3600 * 24 * 7) {
            $notification->addHtmlParameter(
                "footer_text",
                $this->translator->trans("@emails.resetPassword.expiry", [
                    $this->translator->transTime($token->getRemainingTime())
                ])
            );
        }

        return $notification;
    }

    /**
     * @param User $user
     * @param Token $token
     * @return Notification
     */
    public function verificationEmail(User $user, Token $token)
    {
        $notification = new Notification("verifyEmail.check");
        $notification->setUser($user);

        $notification->setHtmlTemplate("email.html.twig");
        $notification->setHtmlParameters([
            "subject" => $this->translator->trans("@emails.verifyEmail.subject"),
            "content" => $this->translator->trans("@emails.verifyEmail.content"),
            "action_text" => $this->translator->trans("@emails.verifyEmail.action_text"),
            "action_url" => $this->router->getUrl("security_verifyEmailWithToken", ["token" => $token->get()])
        ]);

        if ($token->getLifetime() > 0 && $token->getLifetime() < 3600 * 24 * 7) {
            $notification->addHtmlParameter(
                "footer_text",
                $this->translator->trans("@emails.verifyEmail.expiry", [
                    $this->translator->transTime($token->getRemainingTime())
                ])
            );
        }

        return $notification;
    }

    /**
     * @param User $user
     * @param Token $token
     * @return Notification
     */
    public function userWelcomeBack(User $user, Token $token)
    {
        $notification = new Notification("accountWelcomeBack.success");
        $notification->setUser($user);

        $notification->setHtmlTemplate("email.html.twig");
        $notification->setHtmlParameters([
            "subject" => $this->translator->trans("@emails.accountWelcomeBack.subject"),
            "content" => $this->translator->trans("@emails.accountWelcomeBack.content"),
            "action_text" => $this->translator->trans("@emails.accountWelcomeBack.action_text"),
            "action_url" => $this->router->getUrl("security_accountWelcomeBackWithToken", ["token" => $token->get()])
        ]);

        return $notification;
    }
}
