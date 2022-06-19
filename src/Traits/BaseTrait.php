<?php

namespace Base\Traits;

use Base\Annotations\AnnotationReader;
use Base\Database\Factory\ClassMetadataManipulator;
use Base\Database\Factory\EntityHydrator;
use Doctrine\ORM\EntityManagerInterface;
use Base\Notifier\NotifierInterface;
use Base\Routing\RouterInterface;
use Base\Service\BaseService;
use Base\Service\SettingBag;
use Base\Service\IconProvider;
use Base\Service\ImageService;
use Base\Service\LocaleProviderInterface;
use Base\Twig\Extension\BaseTwigExtension;
use Symfony\Component\Security\Http\FirewallMapInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Base\Twig\Environment;
use Symfony\Component\HttpFoundation\RequestStack;

trait BaseTrait
{
    public static function getAnnotationReader() : ?AnnotationReader     { return AnnotationReader::getInstance(); }
    public static function getService()          : ?BaseService          { return (self::class === BaseService::class) ? BaseService::$instance : BaseService::getService(); }
    public static function getSettingBag()       : ?SettingBag           { return (self::class === BaseService::class) ? BaseService::$settings : BaseService::getSettingBag(); }

    public static function isEntity(mixed $entity)     : bool { return BaseService::getClassMetadataManipulator()->isEntity($entity); }

    public static function getProjectDir()    : string { return (self::class === BaseService::class) ? BaseService::$projectDir   : BaseService::getProjectDir(); }
    public static function getEnvironment()   : string { return (self::class === BaseService::class) ? BaseService::$environment   : BaseService::getEnvironment(); }
    public static function getPublicDir()     : string { return BaseService::getProjectDir() . "/public"; }
    public static function getTemplateDir()   : string { return BaseService::getProjectDir() . "/templates"; }
    public static function getTranslationDir(): string { return BaseService::getProjectDir() . "/translations"; }
    public static function getCacheDir()      : string { return BaseService::getProjectDir() . "/var/cache/" . BaseService::getEnvironment(); }
    public static function getLogDir()        : string { return BaseService::getProjectDir() . "/var/log"; }
    public static function getDataDir()       : string { return BaseService::getProjectDir() . "/data"; }

    public static function getClassMetadataManipulator()  : ?ClassMetadataManipulator { return (self::class === BaseService::class) ? BaseService::$classMetadataManipulator   : BaseService::getClassMetadataManipulator(); }
    public static function getRequestStack()  : ?RequestStack            { return (self::class === BaseService::class) ? BaseService::$requestStack : BaseService::getRequestStack(); }
    public static function getEntityHydrator(): ?EntityHydrator          { return (self::class === BaseService::class) ? BaseService::$entityHydrator : BaseService::getEntityHydrator(); }
    public static function getEntityManager() : ?EntityManagerInterface  { return (self::class === BaseService::class) ? BaseService::$entityManager  : BaseService::getEntityManager(); }
    public static function getImageService()  : ?ImageService            { return (self::class === BaseService::class) ? BaseService::$imageService   : BaseService::getImageService(); }
    public static function getIconProvider()  : ?IconProvider            { return (self::class === BaseService::class) ? BaseService::$iconProvider   : BaseService::getIconProvider(); }
    public static function getLocaleProvider(): ?LocaleProviderInterface { return (self::class === BaseService::class) ? BaseService::$localeProvider : BaseService::getLocaleProvider(); }
    public static function getRouter()        : ?RouterInterface         { return (self::class === BaseService::class) ? BaseService::$router         : BaseService::getRouter(); }
    public static function getFirewallMap()   : ?FirewallMapInterface    { return (self::class === BaseService::class) ? BaseService::$firewallMap    : BaseService::getFirewallMap(); }
    public static function getTwigExtension() : ?BaseTwigExtension       { return (self::class === BaseService::class) ? BaseService::$twigExtension  : BaseService::getTwigExtension(); }
    public static function getTwig()          : ?Environment             { return (self::class === BaseService::class) ? BaseService::$twig           : BaseService::getTwig(); }
    public static function getNotifier()      : ?NotifierInterface       { return (self::class === BaseService::class) ? BaseService::$notifier       : BaseService::getNotifier(); }
    public static function getTranslator()    : ?TranslatorInterface     { return (self::class === BaseService::class) ? BaseService::$translator     : BaseService::getTranslator(); }
    public static function getSlugger()       : ?SluggerInterface        { return (self::class === BaseService::class) ? BaseService::$slugger        : BaseService::getSlugger(); }

    public static function getParameterBag(string $key = "", ?array $bag = null)
    {
        $parameterBag = self::class === BaseService::class ? BaseService::$parameterBag   : BaseService::getParameterBag();
        return $key ? $parameterBag->get($key, $bag) : $parameterBag;
    }

}
