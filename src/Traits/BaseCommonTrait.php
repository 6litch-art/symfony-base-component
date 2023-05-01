<?php

namespace Base\Traits;

use Base\Database\Mapping\ClassMetadataManipulator;
use Base\Database\Entity\EntityHydratorInterface;
use Base\Service\BaseService;
use Base\Service\Obfuscator;
use Base\Service\TradingMarketInterface;
use Doctrine\ORM\EntityManagerInterface;
use Base\Routing\RouterInterface;
use Base\Service\SettingBag;
use Base\Service\IconProvider;
use Base\Service\MediaServiceInterface;
use Base\Service\LocalizerInterface;
use Base\Service\ParameterBagInterface;
use Base\Service\SettingBagInterface;
use Twig\Environment;
use Base\Twig\Extension\BaseTwigExtension;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

use Symfony\Component\Notifier\NotifierInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Http\FirewallMapInterface;

trait BaseCommonTrait
{
    /**
     * @var BaseService
     */
    protected static ?BaseService $instance = null;

    public function hasInstance()
    {
        return self::$instance !== null;
    }

    public function getInstance()
    {
        return self::$instance;
    }

    public function setInstance($instance)
    {
        self::$instance = $instance;
    }

    /**
     * @var string
     */
    protected static ?string $projectDir = null;

    public static function setProjectDir($projectDir)
    {
        self::$projectDir = $projectDir;
    }

    /**
     * @var string
     */
    protected static ?string $environment = null;

    public static function setEnvironment(?string $environment)
    {
        self::$environment = $environment;
    }

    /**
     * @var TranslatorInterface
     */
    protected static ?TranslatorInterface $translator = null;

    public static function setTranslator(?TranslatorInterface $translator)
    {
        self::$translator = $translator;
    }

    /**
     * @var RequestStack
     */
    protected static ?RequestStack $requestStack = null;

    public static function setRequestStack(RequestStack $requestStack)
    {
        self::$requestStack = $requestStack;
    }

    /**
     * @var Obfuscator
     */
    protected static ?Obfuscator $obfuscator = null;

    public static function setObfuscator(Obfuscator $obfuscator)
    {
        self::$obfuscator = $obfuscator;
    }

    /**
     * @var EntityManagerInterface
     */
    protected static ?EntityManagerInterface $entityManager = null;

    public static function setEntityManager(EntityManagerInterface $entityManager)
    {
        self::$entityManager = $entityManager;
    }

    /**
     * @var ManagerRegistry
     */
    protected static ?ManagerRegistry $doctrine = null;

    public static function setDoctrine(ManagerRegistry $doctrine)
    {
        self::$doctrine = $doctrine;
    }

    /**
     * @var EntityHydratorInterface
     */
    protected static ?EntityHydratorInterface $entityHydrator = null;

    public static function setEntityHydrator(EntityHydratorInterface $entityHydrator)
    {
        self::$entityHydrator = $entityHydrator;
    }

    /**
     * @var LocalizerInterface
     */
    protected static ?LocalizerInterface $localizer = null;

    public static function setLocalizer(?LocalizerInterface $localizer)
    {
        self::$localizer = $localizer;
    }

    /**
     * @var TradingMarketInterface
     */
    protected static ?TradingMarketInterface $tradingMarket = null;

    public static function setTradingMarket(?TradingMarketInterface $tradingMarket)
    {
        self::$tradingMarket = $tradingMarket;
    }

    /**
     * @var TokenStorageInterface
     */
    protected static ?TokenStorageInterface $tokenStorage = null;

    public static function setTokenStorage(?TokenStorageInterface $tokenStorage)
    {
        self::$tokenStorage = $tokenStorage;
    }

    /**
     * @var SluggerInterface
     */
    protected static ?SluggerInterface $slugger = null;

    public static function setSlugger(?SluggerInterface $slugger)
    {
        self::$slugger = $slugger;
    }

    /**
     * @var IconProvider
     */
    protected static ?IconProvider $iconProvider = null;

    public static function setIconProvider(?IconProvider $iconProvider)
    {
        self::$iconProvider = $iconProvider;
    }

    /**
     * @var ClassMetadataManipulator
     */
    protected static ?ClassMetadataManipulator $classMetadataManipulator = null;

    public static function setClassMetadataManipulator(?ClassMetadataManipulator $classMetadataManipulator)
    {
        self::$classMetadataManipulator = $classMetadataManipulator;
    }

    /**
     * @var MediaServiceInterface
     */
    protected static ?MediaServiceInterface $mediaService = null;

    public static function setMediaService(?MediaServiceInterface $mediaService)
    {
        self::$mediaService = $mediaService;
    }

    /**
     * @var FirewallMapInterface
     */
    protected static ?FirewallMapInterface $firewallMap = null;

    public static function setFirewallMap(?FirewallMapInterface $firewallMap)
    {
        self::$firewallMap = $firewallMap;
    }

    /**
     * @var RouterInterface
     */
    protected static ?RouterInterface $router = null;

    public static function setRouter(RouterInterface $router)
    {
        self::$router = $router;
    }

    /**
     * @var Environment
     */
    protected static Environment $twig;

    public static function setTwig(Environment $twig)
    {
        self::$twig = $twig;
    }

    /**
     * @var BaseTwigExtension
     */
    protected static ?BaseTwigExtension $twigExtension = null;

    public static function setTwigExtension(BaseTwigExtension $twigExtension)
    {
        self::$twigExtension = $twigExtension;
    }

    /**
     * @var SettingBag
     */
    protected static SettingBag $settings;

    public static function setSettingBag(SettingBagInterface $settings)
    {
        self::$settings = $settings;
    }

    /**
     * @var ParameterBagInterface
     */
    protected static ParameterBagInterface $parameterBag;

    public static function setParameterBag(ParameterBagInterface $parameterBag)
    {
        self::$parameterBag = $parameterBag;
    }

    /**
     * @var NotifierInterface
     */
    protected static ?NotifierInterface $notifier = null;

    public static function setNotifier(NotifierInterface $notifier)
    {
        self::$notifier = $notifier;
    }
}
