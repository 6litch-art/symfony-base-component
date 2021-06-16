<?php

namespace Base;

use EasyCorp\Bundle\EasyAdminBundle\DependencyInjection\EasyAdminExtension;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\Asset\Packages;

use Symfony\Component\Finder\Finder;

use Symfony\Component\DependencyInjection\Loader\Configurator as Config;

BaseBundle::setMapping("./Form",       "Base\Form",       "App\Form");
BaseBundle::setMapping("./Entity",     "Base\Entity",     "App\Entity");
BaseBundle::setMapping("./Repository", "Base\Repository", "App\Repository");

class BaseBundle extends Bundle
{
    public static $aliasedRepositories = [];

    public static function setMapping(string $location = "./", string $inputNamespace, string $outputNamespace)
    {
        $baseLocation = dirname((new \ReflectionClass('Base\\BaseBundle'))->getFileName()) . "/";
        $classList = BaseBundle::getAllClasses($inputNamespace, $baseLocation . $location);

        $aliasList = [];
        foreach ($classList as $class)
            $aliasList[$inputNamespace."\\".$class] = $outputNamespace."\\".$class;


        self::setAlias($aliasList);
    }

    public static function setAlias(array $classes)
    {
        foreach ($classes as $input => $output) {

            // Autowire base repositories
            if (str_ends_with($input, "Repository"))
                self::$aliasedRepositories[$input] = null;

            if (class_exists($input) && !class_exists($output)) {

                class_alias($input, $output);

                // Autowire
                if (array_key_exists($input, self::$aliasedRepositories))
                    self::$aliasedRepositories[$input] = $output;
            }

        }
    }

    public static function setAliasEntity($class)
    {
        if (is_array($class)) {

            $classes = $class;
            foreach ($classes as $class) {
                self::setAlias([
                    "Base\\Entity\\" . $class              => "App\\Entity\\" . $class,
                    "Base\\Entity\\" . $class . "Repository" => "App\\Entity\\" . $class . "Repository"
                ]);
            }

            return;
        }

        self::setAlias([
            "Base\\Entity\\" . $class              => "App\\Entity\\" . $class,
            "Base\\Entity\\" . $class . "Repository" => "App\\Entity\\" . $class . "Repository"
        ]);
    }

    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        /* Register aliased repositories */
        foreach(self::$aliasedRepositories as $baseRepository => $aliasedRepository) {

            $container->register($baseRepository)->addTag("doctrine.repository_service")
                      ->addArgument(new Reference('doctrine'));

            if($aliasedRepository) {

                $container->register($aliasedRepository)
                    ->addTag("doctrine.repository_service")
                    ->addArgument(new Reference('doctrine'));
            }
        }
    }

    public static function getAllClasses($prefix, $path): array
    {
        $namespaces = [];

        $filenames = self::getFilenames($path);
        foreach ($filenames as $filename)
            $namespaces[] = self::getFullNamespace($filename, $prefix) . self::getClassname($filename);

        return $namespaces;
    }

    public static function getClassname($filename)
    {
        $directoriesAndFilename = explode('/', $filename);
        $filename = array_pop($directoriesAndFilename);
        $nameAndExtension = explode('.', $filename);
        $className = array_shift($nameAndExtension);
        return $className;
    }

    public static function getFullNamespace($filename, $prefix = "")
    {
        $lines = file($filename);
        $array = preg_grep('/^namespace /', $lines);
        $namespace = array_shift($array);

        $match = [];
        if( preg_match('/^namespace (\\\\?)'. addslashes($prefix).'(\\\\?)(.*);$/', $namespace, $match) ) {

            $array = array_pop($match);
            if(!empty($array)) return $array."\\";
        }

        return "";
    }

    public static function getFilenames($path)
    {
        $finderFiles = Finder::create()->files()->in($path)->name('*.php');
        $filenames = [];
        foreach ($finderFiles as $finderFile) {
            $filenames[] = $finderFile->getRealpath();
        }
        return $filenames;
    }
}
