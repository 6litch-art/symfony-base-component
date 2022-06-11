<?php

namespace Base\Service;

use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Intl\Countries;
use Symfony\Component\Intl\Languages;
use Symfony\Component\Intl\Locales;

class LocaleProvider implements LocaleProviderInterface
{
    protected $requestStack = null;
    protected $parameterBag = null;

    /**
     * @var TranslatorInterface
     */
    protected $translator = null;

    public const SEPARATOR = "-";

    private static ?array $locales = null;
    public static function getLocales()
    {
        if(!self::$locales) {

            self::$locales = [];
            foreach(Locales::getLocales() as $locale) {

                // NB: Only keep xx-YY locale format
                if(!preg_match('/[a-z]{2}.[A-Z]{2}/', $locale)) continue;

                $lang    = substr($locale,0,2);
                $country = substr($locale,3,2);

                if(!array_key_exists($lang, self::$locales)) self::$locales[$lang] = [];
                self::$locales[$lang][] = $country;
            }
        }

        return self::$locales;
    }

    public function __construct(RequestStack $requestStack, ParameterBagInterface $parameterBag, TranslatorInterface $translator)
    {
        $this->requestStack = $requestStack;
        $this->parameterBag = $parameterBag;
        $this->translator   = $translator;

        self::$defaultLocale    = self::$defaultLocale   ?? self::normalize($parameterBag->get("kernel.default_locale"));
        self::$fallbackLocales  = self::$fallbackLocales ?? self::normalizeArray($this->translator->getFallbackLocales());
    }

    protected static $isLate = null; // Turns on when on kernel request
    public static function isLate(): bool { return is_string(self::$isLate) ? true : self::$isLate ?? false; }
    public static function markAsLate(?string $location = null)
    {
        $backtrace = debug_backtrace()[1] ?? null;
        $location = ($backtrace ? $backtrace['class']."::".$backtrace['function'] : true);
        self::$isLate = $location;
    }

    public function getLocale(?string $locale = null): string { return self::normalize($locale ?? $this->translator->getLocale()); }
    public function setLocale(string $locale, ?Request $request = null)
    {
        if($request !== null) {

            if(self::isLate()) {

                $method = __CLASS__."::".__FUNCTION__;
                $location = is_string(self::$isLate) ? self::$isLate : "LocaleSubscriber::onKernelRequest";
                throw new \Exception("You cannot call ".$method.", after \"".$location."\" got triggered.");
            }

            // Symfony request needs underscore separator, regardless of the constant defined above
            $request->setLocale(substr_replace($locale, "_", 2, 1));
        }

        $this->translator->setLocale($locale);
        return $this;
    }

    protected static ?string $defaultLocale   = null;
    protected static ?array $fallbackLocales  = null;
    protected static ?array $availableLocales = null;

    public function setDefaultLocale(?string $defaultLocale) { self::$defaultLocale = $defaultLocale; }
    public static function getDefaultLocale(): ?string { return self::$defaultLocale; }
    public static function getFallbackLocales(): array { return self::$fallbackLocales; }
    public static function getAvailableLocales(): array
    {
        return array_filter(array_unique(array_merge([self::$defaultLocale], self::$fallbackLocales ?? [])));
    }
    public static function getDefaultLang(): ?string { return self::getLang(self::$defaultLocale); }
    public static function getFallbackLangs(): array { return array_map(fn($l) => self::getLang($l), self::$fallbackLocales); }
    public static function getAvailableLangs(): array
    {
        return array_unique(array_merge([self::getDefaultLang()], self::getFallbackLangs() ?? []));
    }
    public static function getDefaultCountry(): ?string { return self::getCountry(self::$defaultLocale); }
    public static function getFallbackCountries(): array { return array_map(fn($l) => self::getCountry($l), self::$fallbackLocales); }
    public static function getAvailableCountries(): array
    {
        return array_unique(array_merge([self::getDefaultCountry()], self::getFallbackCountries() ?? []));
    }

    public static function getLangName(?string $locale = null): ?string { return Languages::getName(self::getLang($locale)); }
    public static function getLang(?string $locale = null): ?string
    {
        $lang = $locale ? substr($locale,0,2) : null;
        if ($lang === null || !array_key_exists($lang, self::getLocales()))
            $lang = self::getDefaultLocale() ? substr(self::getDefaultLocale(),0,2) : null;

        return $lang;
    }

    public static function getCountryName(?string $locale = null): ?string { return Countries::getName(self::getCountry($locale)); }
    public static function getCountry(?string $locale = null): ?string
    {
        $defaultCountry     = self::getDefaultLocale() ? substr(self::getDefaultLocale(),3,2) : null;
        $availableCountries = array_transforms(fn($k, $l):array => $l !== null ? [substr($l,0,2), [substr($l,3,2)]] : null, self::getAvailableLocales());

        $lang           = self::getLang($locale);
        $langCountries  = $availableCountries[$lang] ?? self::getLocales()[$lang] ?? [];

        $country = $locale ? substr($locale,3,2) : null;
        $country = $locale !== null && in_array($country, $langCountries) ? $country : ($langCountries[0] ?? $defaultCountry);

        return $country;
    }

    public static function normalize(?string $locale): string { return self::getLang($locale) . self::SEPARATOR . self::getCountry($locale); }
    public static function normalizeArray(?array $locales): ?array { return array_map(fn ($l) => self::normalize($l), $locales); }
}
