<?php

namespace Base\Service\Traits;

use Base\Service\BaseSettings;
use Base\Service\LocaleProviderInterface;
use Base\Service\ParameterBagInterface;
use Base\Twig\Extension\BaseTwigExtension;
use Twig\Environment;

use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

use Symfony\Component\Notifier\NotifierInterface;

trait BaseCommonTrait {

    /**
     * @var string
     */
    protected static $projectDir = null;
    public static function setProjectDir($projectDir) { return self::$projectDir = $projectDir; }
    
    /**
     * @var string
     */
    protected static $environment = null;
    public static function setEnvironment($environment) { return self::$environment = $environment; }

    /**
     * @var TranslatorInterface
     */
    protected static $translator = null;

    /**
     * @var BaseTwigExtension
     */
    protected static $twigExtension = null;

    public static function setTranslator(?TranslatorInterface $translator) {
        self::$translator = $translator;
        self::$twigExtension = new BaseTwigExtension($translator);
    }

    /**
     * @var LocaleProviderInterface
     */
    protected static $localeProvider = null;
    public static function setLocaleProvider(?LocaleProviderInterface $localeProvider) {  self::$localeProvider = $localeProvider; }

    /**
     * @var SluggerInterface
     */
    protected static $slugger = null;
    public static function setSlugger(?SluggerInterface $slugger) {  self::$slugger = $slugger; }

    /**
     * @var RouterInterface
     */
    protected static $router = null;
    public static function setRouter(RouterInterface $router) { self::$router = $router; }
    
    /**
     * @var Environment
     */
    protected static $twig;
    public static function setTwig(Environment $twig) { self::$twig = $twig; }

    /**
     * @var BaseSettings
     */
    
    protected static $settings;
    public static function setSettings(BaseSettings $settings) { self::$settings = $settings; }

    /**
     * @var ParameterBag
     */
    protected static $parameterBag;
    public static function setParameterBag(ParameterBagInterface $parameterBag) { self::$parameterBag = $parameterBag; }

    /**
     * @var NotifierInterface
     */
    protected static $notifier = null;
    public static function setNotifier(NotifierInterface $notifier) { self::$notifier = $notifier; }
}
