<?php

namespace Base\Notifier;

use App\Entity\User;
use Base\Entity\User\Notification;
use Base\Notifier\NotifierInterface;
use Base\Notifier\Recipient\LocaleRecipientInterface;
use Base\Notifier\Recipient\Recipient;
use Base\Service\BaseService;
use Base\Service\SettingBag;
use Base\Service\LocaleProviderInterface;
use Base\Service\ParameterBagInterface;
use Doctrine\DBAL\Exception\DriverException;
use Doctrine\DBAL\Exception\InvalidFieldNameException;
use Doctrine\DBAL\Exception\TableNotFoundException;
use Doctrine\ORM\Cache\Exception\NonCacheableEntity;
use Doctrine\ORM\EntityManager;
use Exception;
use Symfony\Component\Notifier\Channel\ChannelPolicyInterface;

use Symfony\Component\Notifier\Recipient\EmailRecipientInterface;
use Symfony\Component\Notifier\Recipient\NoRecipient;
use Symfony\Component\Notifier\Recipient\RecipientInterface;
use Symfony\Component\Notifier\Recipient\SmsRecipientInterface;
use Symfony\Contracts\Cache\CacheInterface;

use Symfony\Component\Notifier\NotifierInterface as SymfonyNotifierInterface;
use Symfony\Component\Notifier\Notifier as SymfonyNotifier;
use Symfony\Contracts\Translation\TranslatorInterface;

class Notifier implements NotifierInterface
{
    /**
     * @var SymfonyNotifierInterface
     */
    protected $notifier;

    /**
     * @var ChannelPolicyInterface
     */
    protected $policy;

    public function getPolicy(): ChannelPolicyInterface { return $this->policy; }

    /**
     * @var array
     */
    protected array $options;
    public function getOptions(): array { return $this->options; }

    /**
     * @var array
     */
    protected array $testRecipients;

    public function getTestRecipients(): array{ return $this->testRecipients; }
    public  function isTest(RecipientInterface $recipient): bool
    {
        if(!$recipient instanceof EmailRecipientInterface)
            return false;

        $email = array_keys(mailparse($recipient->getEmail()));
        foreach($this->testRecipients as $testRecipient)
            if( preg_match('/'.$testRecipient->getEmail().'/', begin($email)) ) return true;

        return false;
    }

    /**
     * @var string
     */
    protected string $adminRole;

    public function getAdminRecipient($i = 0): ?Recipient { return $this->notifier->getAdminRecipients()[$i] ?? null; }
    public function getAdminRecipients(): array { return $this->notifier->getAdminRecipients(); }
    protected function getAdminUsers()
    {
        if(!$this->adminRole) return [];

        try {

            $userRepository = $this->entityManager->getRepository(User::class);
            $adminUsers = $userRepository->cacheByRoles($this->adminRole)->getResult();

        } catch(NonCacheableEntity|DriverException|InvalidFieldNameException|TableNotFoundException $e) { $adminUsers = []; }

        return $adminUsers;
    }

    public function getTechnicalRecipient(): RecipientInterface
    {
        $mail = $this->settingBag->getScalar("base.settings.mail");
        if(!$mail) $mail = $this->getAdminRecipient()?->getEmail();
        if(!$mail) return new NoRecipient();

        $mailName = $this->settingBag->getScalar("base.settings.mail.name");
        if(!$mailName) $mailName = mb_ucwords(str_replace([".", "_"], [" ", " "], explode("@", $mail)[0]));
        
        $phone = $this->settingBag->getScalar("base.settings.phone");
        if(!$phone) $phone = $this->getAdminRecipient()?->getPhone();
        
        return new Recipient($mailName." <".$mail.">", $phone);
    }

    /**
     * @var boolean
     */
    protected bool $markAsAdmin;
    public function isMarkAsAdmin() { return $this->markAsAdmin; }
    public function markAsAdmin(bool $markAsAdmin, Notification $notification = null)
    {
        $this->markAsAdmin = $markAsAdmin;

        if ($notification)
            $notification->markAsAdmin();

        return $this;
    }

    /**
     * @var bool
     */
    protected bool $enable = true;
    public function enable()  { $this->enable = true; return $this; }
    public function disable() { $this->enable = false; return $this; }

    public function getTranslator(): TranslatorInterface { return $this->translator; }
    public function setTranslator(TranslatorInterface $translator)
    {
        $this->translator = $translator;
        return $this;
    }

    public function __construct(SymfonyNotifier $notifier, ChannelPolicyInterface $policy,  EntityManager $entityManager, ParameterBagInterface $parameterBag, TranslatorInterface $translator,  LocaleProviderInterface $localeProvider, SettingBag $settingBag)
    {
        $this->notifier      = $notifier;
        $this->policy        = $policy;

        $this->adminRole          = $parameterBag->get("base.notifier.admin_role");
        $this->options            = $parameterBag->get("base.notifier.options") ?? [];

        $this->testRecipients     = array_map(fn($r) => new Recipient($r), $parameterBag->get("base.notifier.test_recipients"));

        $technicalEmail = $parameterBag->get("base.notifier.technical_recipient.email");
        $technicalPhone = $parameterBag->get("base.notifier.technical_recipient.phone");
        $this->technicalRecipient = ($technicalEmail || $technicalPhone) ? new Recipient($technicalEmail, $technicalPhone) : null;

        $this->entityManager  = $entityManager;
        $this->settingBag     = $settingBag;
        $this->localeProvider = $localeProvider;
        $this->translator     = $translator;

        // Address support only once..
        $adminRecipients = [];
        foreach ($this->getAdminUsers() as $adminUser)
            $adminRecipients[] = $adminUser->getRecipient();

        foreach (array_unique_map(fn($r) => $r->getEmail(), $adminRecipients) as $adminRecipient)
           $this->notifier->addAdminRecipient($adminRecipient);
    }

    public function getDefaultChannels(string $importance) { return User::getNotifier()->getPolicy()->getChannels($importance); }

    protected function getUserChannels($importance, RecipientInterface $recipient): array
    {
        $channels = [];
        foreach($this->getDefaultChannels($importance) as $channel) {

            // Replace email by email+ for user..
            // Users should not receive the default admin email sent by Symfony notifier
            if (str_starts_with($channel, "email")) $channel = "email+";

            // If no recipient, only browser notification is allowed to be sent.
            if($recipient instanceof NoRecipient && !str_starts_with($channel, "browser"))
                continue;

            // If recipient implement SMS interface, check if sms is allowed and phone number available
            else if(str_starts_with($channel, "sms")) {

                if($recipient instanceof SmsRecipientInterface && empty($recipient->getPhone()))
                    continue;
            }

            // If recipient implement Email interface, check if email is available
            else if(str_starts_with($channel, "email")) {

                if($recipient instanceof EmailRecipientInterface && empty($recipient->getEmail()))
                    continue;
            }

            // Only admin can receive chat message..
            else if(str_starts_with($channel, "chat/"))
                continue;

            $channels[] = $channel;
        }

        return array_unique($channels);
    }

    protected function getAdminChannels($importance, RecipientInterface $recipient): array
    {
        $channels = [];
        foreach ($this->getDefaultChannels($importance) as $channel) {

            // Replace email by email+ for user..
            // Users should not receive the default admin email sent by Symfony notifier
            if (str_starts_with($channel, "email"  )) $channel = "email";

            // I suppose admin should receive notification by email when user is browser notified.
            else if (str_starts_with($channel, "browser")) $channel = "email";

            // If no recipient, only browser notification is allowed to be sent.
            else if ($recipient instanceof NoRecipient) continue;

            // If recipient implement SMS interface, check if sms is allowed and phone number available
            else if (str_starts_with($channel, "sms")) {

                if($recipient instanceof SmsRecipientInterface && empty($recipient->getPhone()) )
                    continue;
            }

            // If recipient implement Email interface, check if email is available
            else if (str_starts_with($channel, "email")) {

                if( $recipient instanceof EmailRecipientInterface && empty($recipient->getEmail()) )
                    continue;
            }

            else if (str_starts_with($channel, "chat/")) {

                $firstAdminRecipient = $this->getAdminRecipients()[0] ?? null;
                if($recipient != $firstAdminRecipient) continue;
            }

            $channels[] = $channel;
        }

        return array_unique($channels);
    }

    public function send(\Symfony\Component\Notifier\Notification\Notification $notification, RecipientInterface ...$recipients): void
    {
        if ($this->enable) 
            $this->notifier->send($notification, ...$recipients);
    }

    public function sendUsers(Notification $notification, RecipientInterface ...$recipients)
    {
        // Set importance of the notification
        $this->markAsAdmin(false);

        $prevChannels = $notification->getChannels();
        $notification->setChannels([]);

        // Admin recipient if test address
        $technicalRecipient = $this->getTechnicalRecipient();

        // Determine recipient information
        foreach ($recipients as $recipient) {

            // Set selected channels, if any
            $channels    = $this->getUserChannels($notification->getImportance(), $recipient);
            if (empty($channels))
                throw new Exception("No valid channel for the notification \"".$notification->getBacktrace()."\" sent with \"".$notification->getImportance()."\"");

            $prevChannels = array_merge($prevChannels, $channels);
            $notification->setChannels($channels);
            $notification->markAsReadIfNeeded($channels);

            // Send notification with proper locale
            $localeBak = $this->localeProvider->getLocale();
            $locale = $this->localeProvider->getLocale($recipient instanceof LocaleRecipientInterface ? $recipient->getLocale() : null);
            $this->localeProvider->setLocale($locale);

            $this->send($notification, $this->isTest($recipient) ? $technicalRecipient : $recipient);
            $this->localeProvider->setLocale($localeBak);
        }

        $notification->setChannels($prevChannels);
        $notification->setSentAt(new \DateTime("now"));

        return $this;
    }

    public function sendUsersBy(array $channels, Notification $notification, ...$recipients)
    {
        // Set importance of the notification
        $this->markAsAdmin(false);

        $prevChannels = $notification->getChannels();
        $notification->setChannels([]);

        // Admin recipient if test address
        $technicalRecipient = $this->getTechnicalRecipient();

        foreach ($recipients as $recipient) {

            // Determine channels
            $channels   = array_intersect($channels, $this->getUserChannels($notification->getImportance(), $recipient));
            $prevChannels = array_merge($prevChannels, $channels);

            if (empty($channels)) continue;
            $notification->setChannels($channels);

            // Send notification with proper locale
            $localeBak = $this->localeProvider->getLocale();
            $locale = $this->localeProvider->getLocale($recipient instanceof LocaleRecipientInterface ? $recipient->getLocale() : null);
            $this->localeProvider->setLocale($locale);

            $this->send($notification, $this->isTest($recipient) ? $technicalRecipient : $recipient);
            $this->localeProvider->setLocale($localeBak);
        }

        $notification->setChannels($prevChannels);
        $notification->setSentAt(new \DateTime("now"));

        return $this;
    }

    public function sendAdmins(Notification $notification)
    {
        // Set importance of the notification
        $this->markAsAdmin(true, $notification);

        // Reset channels and keep here them for later use
        $prevChannels = $notification->getChannels();
        $notification->setChannels([]);

        // Back up channels and importance variables..
        // to be restored at the end of the method
        $recipients = $this->getAdminRecipients() ?? [new NoRecipient()];
        foreach($recipients as $recipient) {

            // Set selected channels, if any
            $channels    = $this->getAdminChannels($notification->getImportance(), $recipient);
            if (empty($channels)) return $this;
            $notification->setChannels($channels);

            // Send notification with proper locale
            $localeBak = $this->localeProvider->getLocale();
            $locale = $this->localeProvider->getLocale($recipient instanceof LocaleRecipientInterface ? $recipient->getLocale() : null);
            $this->localeProvider->setLocale($locale);
            
            $this->send($notification, $recipient);
            $this->localeProvider->setLocale($localeBak);
        }

        $notification->setChannels($prevChannels);

        $this->markAsAdmin(false);
        return $this;
    }
}
