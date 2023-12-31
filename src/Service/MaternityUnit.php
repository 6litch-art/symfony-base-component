<?php

namespace Base\Service;

use Base\Entity\User\Notification;
use Base\Routing\RouterInterface;
use DateTime;
use Base\Service\Model\IntlDateTime;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class MaternityUnit implements MaternityUnitInterface
{
    /** @var Router */
    protected $router;
    /** @var ParameterBag */
    protected $parameterBag;
    /** @var SettingBag */
    protected $settingBag;
    /** @var AuthorizationChecker */
    protected $authorizationChecker;
    /** @var TokenStorage */
    protected $tokenStorage;

    public function __construct(RouterInterface $router, ParameterBagInterface $parameterBag, SettingBagInterface $settingBag, AuthorizationCheckerInterface $authorizationChecker, TokenStorageInterface $tokenStorage)
    {
        $this->router = $router;
        $this->parameterBag = $parameterBag;
        $this->settingBag = $settingBag;
        $this->authorizationChecker = $authorizationChecker;
        $this->tokenStorage = $tokenStorage;
    }

    public function getBirthdate(?string $locale = null): ?DateTime
    {
        $birthdate = $this->settingBag->getScalar("base.settings.birthdate", $locale);
        if (!$birthdate) {
            return null;
        }

        return $birthdate instanceof DateTime ? $birthdate : new DateTime($birthdate);
    }

    public function isBorn(?string $locale = null): ?bool
    {
        $birthdate = $this->getBirthdate($locale);
        if ($birthdate === null) {
            return false;
        }

        $now = new \DateTime("now");
        return ($birthdate < $now);
    }

    public function getAge(?string $locale = null): string
    {
        $currentYear = date("Y");
        $birthdate = $this->getBirthdate($locale);
        if (!$birthdate) {
            return $currentYear;
        }

        $birthYear = $birthdate->format("Y");
        return $this->isBorn($locale) && $birthYear < $currentYear ? date("$birthYear-Y") : $birthYear;
    }

    public function redirectOnDeny(?RequestEvent $event = null, ?string $locale = null): bool
    {
        if (!$this->settingBag->getScalar("base.settings.birthdate.redirect_on_deny")) {
            return false;
        }
        if (!$this->getBirthdate()) {
            return false;
        }

        $redirectOnDeny = "security_birth";
        if ($this->router->isUX()) {
            return false;
        }
        if ($this->router->isProfiler()) {
            return false;
        }
        if ($this->router->isEasyAdmin()) {
            return false;
        }
        if ($this->router->isSecured()) {
            return false;
        }

        if ($this->isBorn()) {
            $homepageRoute = $this->parameterBag->get("base.site.homepage");
            if ($event && $redirectOnDeny == $this->router->getRouteName()) {
                $event->setResponse($this->router->redirect($homepageRoute, [], 302));
            }

            return false;
        } elseif ($this->authorizationChecker->isGranted("ROLE_EDITOR")) {
            $birthdate = $this->getBirthdate();
            $notification = new Notification("maternityUnit.banner", [IntlDateTime::createFromDateTime($birthdate, $locale)->format("dd MMMM YYYY"), IntlDateTime::createFromDateTime($birthdate, $locale)->format("HH:mm")]);
            $notification->send("warning");
            return false;
        }

        if ($this->router->getRouteName() == $redirectOnDeny) {
            return false;
        }
        if ($this->authorizationChecker->isGranted("BIRTH_ACCESS")) {
            return false;
        }

        if ($event) {
            $this->router->redirectToRoute($redirectOnDeny, [], 302, ["event" => $event]);
        }

        $token = $this->tokenStorage->getToken();
        if ($token && $token->getUser()) {
            $token->getUser()->Logout();
        }

        return true;
    }
}
