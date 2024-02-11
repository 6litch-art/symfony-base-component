<?php

namespace Base\Annotations;

use Doctrine\Common\Annotations\AnnotationReader as DoctrineAnnotationReader;
use Doctrine\ORM\EntityManager;

use Base\Database\Entity\EntityHydrator;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Exception\NotSupported;
use Doctrine\Persistence\ObjectRepository;
use Exception;

use App\Entity\User;
use Base\BaseBundle;
use Base\Cache\Abstract\AbstractLocalCache;
use Base\Database\Entity\EntityHydratorInterface;
use Base\Database\Mapping\ClassMetadataManipulator;
use Base\Routing\RouterInterface;
use Base\Service\FlysystemInterface;
use Base\Traits\SingletonTrait;
use Doctrine\ORM\Mapping\ClassMetadata;
use ReflectionClass;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\SwitchUserToken;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 *
 */
class AnnotationReader extends AbstractLocalCache
{
    use SingletonTrait;

    public const TARGET_CLASS = "class";
    public const TARGET_METHOD = "method";
    public const TARGET_PROPERTY = "property";

    public const ALL_TARGETS = [
        self::TARGET_CLASS,
        self::TARGET_METHOD,
        self::TARGET_PROPERTY
    ];

    // Annotation pass..
    protected array $annotations = [];

    /**
     * @param $annotations
     * @return $this
     */
    /**
     * @param $annotations
     * @return $this
     */
    public function addAnnotation($annotations): self
    {
        $this->annotations[get_class($annotations)] = $annotations;
        return $this;
    }

    /**
     * @var EntityManager|null
     */
    protected ?EntityManager $entityManager = null;

    /**
     * @return EntityManager|null
     */
    public function getEntityManager()
    {
        return $this->entityManager;
    }

    /**
     * @param $entity
     * @return EntityRepository|ObjectRepository
     * @throws NotSupported
     */
    public function getRepository($entity)
    {
        return $this->entityManager->getRepository($entity);
    }

    public function isEntity(mixed $entity): bool
    {
        return $this->classMetadataManipulator->isEntity($entity);
    }

    /**
     * @var EntityHydrator|null
     */
    protected ?EntityHydrator $entityHydrator = null;

    public function getEntityHydrator(): EntityHydratorInterface
    {
        return $this->entityHydrator;
    }

    /**
     * @var ClassMetadataManipulator|null
     */
    protected ?ClassMetadataManipulator $classMetadataManipulator = null;

    public function getClassMetadataManipulator(): ClassMetadataManipulator
    {
        return $this->classMetadataManipulator;
    }

    /**
     * @var FlysystemInterface|null
     */
    protected ?FlysystemInterface $flysystem = null;

    public function getFlysystem(): FlysystemInterface
    {
        return $this->flysystem;
    }

    /**
     * @var ParameterBagInterface
     */
    protected ParameterBagInterface $parameterBag;

    public function getParameterBag(): ParameterBagInterface
    {
        return $this->parameterBag;
    }

    /**
     * @var DoctrineAnnotationReader|null
     */
    protected ?DoctrineAnnotationReader $reader = null;

    public function getDoctrineReader(): DoctrineAnnotationReader
    {
        return $this->reader;
    }

    /**
     * @var string
     */
    protected string $environment;

    /**
     * @var string
     */
    protected string $projectDir;

    /**
     * @var string
     */
    protected string $cacheDir;

    /**
     * @var bool
     */
    protected bool $enabled;

    /**
     * @var RequestStack
     */
    protected RequestStack $requestStack;

    /**
     * @var TokenStorageInterface
     */
    protected TokenStorageInterface $tokenStorage;

    /**
     * @var EventDispatcherInterface
     */
    protected EventDispatcherInterface $eventDispatcher;

    /**
     * @var RouterInterface
     */
    protected RouterInterface $router;

    public function __construct(
        EventDispatcherInterface $eventDispatcher,
        RouterInterface          $router,
        EntityManager            $entityManager,
        ParameterBagInterface    $parameterBag,
        FlysystemInterface       $flysystem,
        RequestStack             $requestStack,
        TokenStorageInterface    $tokenStorage,
        EntityHydrator           $entityHydrator,
        ClassMetadataManipulator $classMetadataManipulator,
        string                   $projectDir,
        string                   $environment,
        string                   $cacheDir
    )
    {
        if (!self::getInstance(false)) {
            self::setInstance($this);
        }

        $this->reader = new DoctrineAnnotationReader();

        // Check if custom reader is enabled
        $this->parameterBag = $parameterBag;
        $this->enabled = $parameterBag->get("base.annotations.use_custom") ?? false;

        $paths = [];
        $paths[] = __DIR__ . "/Annotation";
        $paths[] = __DIR__ . "/../Database/Annotation";
        if (($matches = preg_grep('/^base.annotations.paths\.[0-9]*\.[.*]*$/', array_keys($parameterBag->all())))) {
            foreach ($matches as $match) {
                $paths[] = $parameterBag->get($match);
            }
        }

        // Paths to look for annotations
        foreach ($paths as $path) {
            $this->addPath($path);
        }

        $this->entityManager = $entityManager;
        $this->entityHydrator = $entityHydrator;
        $this->requestStack = $requestStack;
        $this->tokenStorage = $tokenStorage;
        $this->flysystem = $flysystem;
        $this->eventDispatcher = $eventDispatcher;
        $this->router = $router;
        $this->classMetadataManipulator = $classMetadataManipulator;

        $this->environment = $environment;
        $this->projectDir = $projectDir;

        parent::__construct($cacheDir);
    }

    /**
     * @return string
     */
    public function getEnvironment()
    {
        return $this->environment;
    }

    /**
     * @return string
     */
    public function getProjectDir()
    {
        return $this->projectDir;
    }

    protected $cache = null;
    protected array $cachePool = [];

    protected array $annotationTargets = [];

    protected array $classAncestors = [];
    protected array $classHierarchies = [];

    protected array $classAnnotations = [];
    protected array $methodAnnotations = [];
    protected array $propertyAnnotations = [];

    /**
     * @var array
     */
    protected array $paths = [];

    public function getPaths(): array
    {
        return $this->paths;
    }

    public function addPath(string $path): self
    {
        if (in_array($path, $this->paths)) {
            return $this;
        }

        if (!file_exists($path)) {
            return $this;
        }
        foreach (BaseBundle::getInstance()->getAllClasses($path) as $annotation) {
            $this->addAnnotationName($annotation);
        }

        return $this;
    }

    public function getAsset(string $url): string
    {
        $url = trim($url);
        $parseUrl = parse_url($url);
        if ($parseUrl["scheme"] ?? false) {
            return $url;
        }

        $request = $this->requestStack->getCurrentRequest();
        $baseDir = $request ? $request->getBasePath() : $_SERVER["CONTEXT_PREFIX"] ?? "";

        $path = trim($parseUrl["path"]);
        if ($path == "/") {
            return $baseDir;
        } elseif (!str_starts_with($path, "/")) {
            $path = $baseDir . "/" . $path;
        }

        return $path;
    }

    public function getUser(): ?UserInterface
    {
        return $this->tokenStorage->getToken()?->getUser();
    }

    public function getImpersonator(): ?User
    {
        $token = $this->tokenStorage->getToken();
        return ($token instanceof SwitchUserToken ? $token->getOriginalToken()->getUser() : null);
    }

    protected array $annotationNames = [];

    public function getAnnotationNames(): array
    {
        return $this->annotationNames;
    }

    /**
     * @param string $annotationName
     * @return $this
     */
    /**
     * @param string $annotationName
     * @return $this
     */
    public function addAnnotationName(string $annotationName)
    {
        if (!is_subclass_of($annotationName, AbstractAnnotation::class)) {
            return $this;
        }

        if (!in_array($annotationName, $this->annotationNames)) {
            $this->annotationNames[] = $annotationName;
        }

        return $this;
    }

    /**
     * @param string $annotationName
     * @return $this
     */
    /**
     * @param string $annotationName
     * @return $this
     */
    public function removeAnnotationName(string $annotationName)
    {
        if (($pos = array_search($annotationName, $this->annotationNames))) {
            unset($this->annotationNames[$pos]);
        }

        return $this;
    }

    public function getAnnotationTargets(object|string $className): array // Annotation class
    {
        $className = (is_object($className) ? get_class($className) : $className);

        if (array_key_exists($className, $this->annotationTargets)) {
            return $this->annotationTargets[$className];
        }

        $reflClass = new ReflectionClass($className);

        $annotationTargets = [];
        $reflClass = new ReflectionClass($className);
        if(!empty($reflClass->getAttributes())) {

            foreach($reflClass->getAttributes() as $attribute) {
                
                if($attribute->getName() != "Attribute") continue;
                
                $targets = $attribute->getArguments()[0] ?? 0;
                if($targets & \Attribute::TARGET_CLASS) $annotationTargets[] = "class";
                if($targets & \Attribute::TARGET_METHOD) $annotationTargets[] = "method";
                if($targets & \Attribute::TARGET_PROPERTY) $annotationTargets[] = "property";
            }
            
        } else {

            if (preg_match_all('/@Target\(\{(.*)\}\)/', $reflClass->getDocComment(), $matches, PREG_SET_ORDER)) {
                $annotationTargets = json_decode(mb_strtolower("[" . end($matches)[1] . "]"));
            }
        }

        foreach ($annotationTargets as $target) {
            switch ($target) {
                case 'all':
                    $this->annotationTargets[$className][] = "class";
                    $this->annotationTargets[$className][] = "method";
                    $this->annotationTargets[$className][] = "property";

                    // Not used at this time by the custom AnnotationReader
                    $this->annotationTargets[$className][] = "annotation";
                    $this->annotationTargets[$className][] = "attribute";
                    $this->annotationTargets[$className][] = "function";
                    break;

                case 'class':
                case 'method':
                case 'property':
                case 'annotation':
                case 'function':
                    $this->annotationTargets[$className][] = $target;
                    break;

                default:
                    throw new Exception("Unexpected @Target parameter in " . $className);
            }
        }

        $this->setCache("/Targets", $this->annotationTargets, null, true);
        return $this->annotationTargets[$className] ?? [];
    }

    /**
     * Everything related to hierarchy
     *
     * @return string|null
     * @var string
     */
    public function getParent(string $className): ?string
    {
        return $this->classHierarchies[$className] ?? null;
    }

    /**
     * @param $className
     * @return string|null
     */
    public function getAncestor($className): ?string
    {
        if (!array_key_exists($className, $this->classAncestors)) {
            $classAncestor = $className;
            while (($parentClass = $this->getParent($classAncestor))) {
                $classAncestor = $parentClass;
            }

            $this->classAncestors[$className] = $classAncestor;
            $this->setCache("/Ancestors", $this->classAncestors, null, true);
        }

        return $this->classAncestors[$className];
    }

    /**
     * @param $className
     * @param $annotationNames
     * @param $annotationTargets
     * @return array[]
     * @throws Exception
     */
    public function getAncestorAnnotations($className, $annotationNames = null, $annotationTargets = [])
    {
        $classAncestor = $this->getAncestor($className);
        return $this->getAnnotations($classAncestor, $annotationNames, $annotationTargets);
    }

    /**
     * @param $className
     * @param $annotationNames
     * @param $annotationTargets
     * @return array[]
     * @throws Exception
     */
    public function getParentAnnotations($className, $annotationNames = null, $annotationTargets = [])
    {
        $parent = $this->getParent($className);
        return $this->getAnnotations($parent, $annotationNames, $annotationTargets);
    }

    /**
     * @param $className
     * @return array
     */
    public function getChildren($className)
    {
        $children = [];

        foreach (get_declared_classes() as $candidate) {
            if (is_subclass_of($candidate, $className)) {
                $children[] = $candidate;
            }
        }

        return $children;
    }

    /**
     * @param $className
     * @param $annotationNames
     * @param $annotationTargets
     * @return array|mixed
     * @throws Exception
     */
    public function getChildrenAnnotations($className, $annotationNames = null, $annotationTargets = [])
    {
        $annotations = [];
        foreach ($this->getChildren($className) as $child) {
            $childrenAnnotations = $this->getChildrenAnnotations($child, $annotationNames, $annotationTargets);
            $annotations = array_append_recursive(
                $annotations,
                array_append_recursive(
                    $this->getAnnotations($child, $annotationNames, $annotationTargets),
                    $childrenAnnotations
                )
            );
        }

        return $annotations;
    }

    /**
     * @param $classNameOrMetadataOrRefl
     * @param $annotationNames
     * @return array
     */
    public function getDoctrineClassAnnotations($classNameOrMetadataOrRefl, $annotationNames = null)
    {
        $reflClass = $this->getReflClass($classNameOrMetadataOrRefl);

        $annotations = $this->getDoctrineReader()->getClassAnnotations($reflClass);
        $annotationNames = $this->normalizeNames($annotationNames, false);

        return array_filter($annotations, fn($a) => $annotationNames === null || in_array(get_class($a), $annotationNames));
    }

    public function getClassAnnotations(mixed $classNameOrMetadataOrRefl, mixed $annotationNames = null, array $annotationTargets = []): array
    {
        $annotationNames = $this->normalizeNames($annotationNames);
        $annotationTargets = $this->normalizeTargets($annotationTargets, $annotationNames);
        if (!in_array(self::TARGET_CLASS, $annotationTargets)) {
            return [];
        }

        $reflClass = $this->getReflClass($classNameOrMetadataOrRefl);
        if (!array_key_exists($reflClass->name, $this->classAnnotations)) {

            $this->classAnnotations[$reflClass->name] = [];
            
            foreach($reflClass->getAttributes() as $attribute) {

                $annotation = $attribute->newInstance();
                if (!is_serializable($annotation)) {
                    throw new Exception("Attribute \"" . get_class($annotation) . "\" failed to serialize. Please implement __serialize/__unserialize, or double-check properties.");
                }

                $this->classAnnotations[$reflClass->name][] = $annotation;
            }

            // Compute the class annotations
            foreach ($this->getDoctrineReader()->getClassAnnotations($reflClass) as $annotation) {
                if (!is_serializable($annotation)) {
                    throw new Exception("Annotation \"" . get_class($annotation) . "\" failed to serialize. Please implement __serialize/__unserialize, or double-check properties.");
                }

                $this->classAnnotations[$reflClass->name][] = $annotation;
            }

            $this->setCache("/ClassAnnotations", $this->classAnnotations, null, true);
        }

        return $this->filterClassAnnotations($reflClass->name, $annotationNames);
    }

    /**
     * @param string $className
     * @param mixed $annotationNames
     * @param array|null $classAnnotations
     * @return array|mixed
     */
    protected function filterClassAnnotations(string $className, mixed $annotationNames, ?array $classAnnotations = null)
    {
        $classAnnotations ??= $this->classAnnotations;

        // Return the full set of annotations for a given class
        if ($annotationNames == $this->getAnnotationNames()) {
            return $classAnnotations[$className] ?? [];
        }

        // Filter them ask request by the $annontationNames
        $filteredAnnotations = [];
        foreach ($classAnnotations[$className] ?? [] as $annotation) {
            if (in_array(get_class($annotation), $annotationNames)) {
                $filteredAnnotations[] = $annotation;
            }
        }

        return $filteredAnnotations;
    }

    /**
     * @param mixed $classNameOrMetadataOrRefl
     * @param mixed|null $annotationNames
     * @return array
     */
    public function getDoctrineMethodAnnotations(mixed $classNameOrMetadataOrRefl, mixed $annotationNames = null)
    {
        $reflClass = $this->getReflClass($classNameOrMetadataOrRefl);

        $annotations = [];
        $annotationNames = $this->normalizeNames($annotationNames, false);

        foreach ($reflClass->getMethods() as $reflMethod) {
            $annotations[$reflMethod->getName()] = array_filter(
                $this->getDoctrineReader()->getMethodAnnotations($reflMethod),
                fn($a) => $annotationNames === null || in_array(get_class($a), $annotationNames)
            );
        }

        return array_filter($annotations);
    }

    public function getMethodAnnotations(mixed $classNameOrMetadataOrRefl, mixed $annotationNames = null, array $annotationTargets = []): array
    {
        $annotationNames = $this->normalizeNames($annotationNames);
        $annotationTargets = $this->normalizeTargets($annotationTargets, $annotationNames);
        if (!in_array(self::TARGET_METHOD, $annotationTargets)) {
            return [];
        }

        $reflClass = $this->getReflClass($classNameOrMetadataOrRefl);
        if (!array_key_exists($reflClass->name, $this->methodAnnotations)) {

            // Compute the class annotations
            $this->methodAnnotations[$reflClass->name] = [];
            foreach ($reflClass->getMethods() as $reflMethod) {

                $this->methodAnnotations[$reflClass->name][$reflMethod->name] = [];
                foreach($reflMethod->getAttributes() as $attribute) {

                    $annotation = $attribute->newInstance();
                    if (!is_serializable($annotation)) {
                        throw new Exception("Attribute \"" . get_class($annotation) . "\" failed to serialize. Please implement __serialize/__unserialize, or double-check properties.");
                    }

                    $this->methodAnnotations[$reflClass->name][$reflMethod->name][] = $annotation;
                }

                foreach ($this->getDoctrineReader()->getMethodAnnotations($reflMethod) as $annotation) {
                    if (!is_serializable($annotation)) {
                        throw new Exception("Annotation \"" . get_class($annotation) . "\" failed to serialize. Please implement __serialize/__unserialize, or double-check properties.");
                    }

                    $this->methodAnnotations[$reflClass->name][$reflMethod->name][] = $annotation;
                }
            }

            $this->setCache("/MethodAnnotations", $this->methodAnnotations, null, true);
        }

        return $this->filterMethodAnnotations($reflClass->name, $annotationNames);
    }

    /**
     * @param string $className
     * @param mixed $annotationNames
     * @param array|null $methodAnnotations
     * @return array|mixed
     */
    protected function filterMethodAnnotations(string $className, mixed $annotationNames, ?array $methodAnnotations = null)
    {
        $methodAnnotations ??= $this->methodAnnotations;

        // Return the full set of annotations for a given class
        if ($annotationNames == $this->getAnnotationNames()) {
            return $methodAnnotations[$className] ?? [];
        }

        // Filter them ask request by the $annontationNames
        $filteredAnnotations = [];
        foreach ($methodAnnotations[$className] ?? [] as $method => $_) {
            foreach ($_ as $annotation) {
                if (in_array(get_class($annotation), $annotationNames)) {
                    $filteredAnnotations[$method][] = $annotation;
                }
            }
        }

        return $filteredAnnotations;
    }

    /**
     * @param mixed $classNameOrMetadataOrRefl
     * @param mixed|null $annotationNames
     * @return array
     */
    public function getDoctrinePropertyAnnotations(mixed $classNameOrMetadataOrRefl, mixed $annotationNames = null)
    {
        $reflClass = $this->getReflClass($classNameOrMetadataOrRefl);

        $annotations = [];
        $annotationNames = $this->normalizeNames($annotationNames, false);

        foreach ($reflClass->getProperties() as $reflProperty) {
            $annotations[$reflProperty->getName()] = array_filter(
                $this->getDoctrineReader()->getPropertyAnnotations($reflProperty),
                fn($a) => $annotationNames === null || in_array(get_class($a), $annotationNames)
            );
        }

        return array_filter($annotations);
    }

    public function getPropertyAnnotations(mixed $classNameOrMetadataOrRefl, mixed $annotationNames = null, array $annotationTargets = []): array
    {
        $annotationNames = $this->normalizeNames($annotationNames);
        $annotationTargets = $this->normalizeTargets($annotationTargets, $annotationNames);
        if (!in_array(self::TARGET_PROPERTY, $annotationTargets)) {
            return [];
        }

        $reflClass = $this->getReflClass($classNameOrMetadataOrRefl);
        if (!array_key_exists($reflClass->name, $this->propertyAnnotations)) {
            // Force to get all known annotations when buffering
            $this->propertyAnnotations[$reflClass->name] = [];
            foreach ($reflClass->getProperties() as $reflProperty) {

                $this->propertyAnnotations[$reflClass->name][$reflProperty->name] = [];
                foreach($reflProperty->getAttributes() as $attribute) {

                    $annotation = $attribute->newInstance();
                    if (!is_serializable($annotation)) {
                        throw new Exception("Attribute \"" . get_class($annotation) . "\" failed to serialize. Please implement __serialize/__unserialize, or double-check properties.");
                    }

                    $this->propertyAnnotations[$reflClass->name][$reflProperty->name][] = $annotation;
                }

                foreach ($this->getDoctrineReader()->getPropertyAnnotations($reflProperty) as $annotation) {

                    if (!is_serializable($annotation)) {
                        throw new Exception("Annotation \"" . get_class($annotation) . "\" failed to serialize. Please implement __serialize/__unserialize, or double-check properties.");
                    }

                    $this->propertyAnnotations[$reflClass->name][$reflProperty->name][] = $annotation;
                }
            }

            $this->setCache("/PropertyAnnotations", $this->propertyAnnotations, null, true);
        }

        return $this->filterPropertyAnnotations($reflClass->name, $annotationNames);
    }

    /**
     * @param string $className
     * @param mixed $annotationNames
     * @param array|null $propertyAnnotations
     * @return array|mixed
     */
    protected function filterPropertyAnnotations(string $className, mixed $annotationNames, ?array $propertyAnnotations = null)
    {
        $propertyAnnotations ??= $this->propertyAnnotations;

        // Return the full set of annotations for a given class
        if ($annotationNames == $this->getAnnotationNames()) {
            return $propertyAnnotations[$className] ?? [];
        }

        // Filter them by the $annontationNames
        $filteredAnnotations = [];
        foreach ($propertyAnnotations[$className] ?? [] as $property => $_) {
            foreach ($_ as $annotation) {
                if (in_array(get_class($annotation), $annotationNames)) {
                    $filteredAnnotations[$property][] = $annotation;
                }
            }
        }

        return $filteredAnnotations;
    }

    /**
     * @param $classNameOrMetadataOrRefl
     * @return ReflectionClass|null
     */
    public function getReflClass($classNameOrMetadataOrRefl)
    {
        if ($classNameOrMetadataOrRefl instanceof ReflectionClass) {
            return $classNameOrMetadataOrRefl;
        } elseif ($classNameOrMetadataOrRefl instanceof ClassMetadata) {
            return $classNameOrMetadataOrRefl->getReflectionClass();
        } else {
            return new ReflectionClass($classNameOrMetadataOrRefl);
        }
    }

    /**
     * @param $classNameOrMetadataOrRefl
     * @param $annotationNames
     * @param array $annotationTargets
     * @return array|array[]
     * @throws Exception
     */
    public function getDoctrineAnnotations($classNameOrMetadataOrRefl, $annotationNames = null, array $annotationTargets = []): array
    {
        if ($classNameOrMetadataOrRefl == null) {
            return [];
        }
        $reflClass = $this->getReflClass($classNameOrMetadataOrRefl);

        $annotations = [self::TARGET_CLASS => [], self::TARGET_METHOD => [], self::TARGET_PROPERTY => []];
        $annotationNames = $this->normalizeNames($annotationNames, false);
        $annotationTargets = $this->normalizeTargets($annotationTargets, $annotationNames);

        // Get class annotations
        if (in_array(self::TARGET_CLASS, $annotationTargets)) {
            $annotations[self::TARGET_CLASS][$reflClass->getName()] =
                $this->getDoctrineClassAnnotations($reflClass, $annotationNames);
        }

        // Get method annotations
        if (in_array(self::TARGET_METHOD, $annotationTargets)) {
            $annotations[self::TARGET_METHOD][$reflClass->getName()] =
                $this->getDoctrineMethodAnnotations($reflClass, $annotationNames);
        }

        // Get properties annotations
        if (in_array(self::TARGET_PROPERTY, $annotationTargets)) {
            $annotations[self::TARGET_PROPERTY][$reflClass->getName()] =
                $this->getDoctrinePropertyAnnotations($reflClass, $annotationNames);
        }

        return $annotations;
    }

    public function normalizeNames(mixed $annotationNames, bool $fallbackAnnotationNames = true): ?array
    {
        $annotationNames = $annotationNames === null ? null : array_unique(
            (is_array($annotationNames) ? $annotationNames :
                (is_object($annotationNames) ? [get_class($annotationNames)] :
                    (is_string($annotationNames) ? [$annotationNames] : [])))
        );

        if ($fallbackAnnotationNames && empty($annotationNames)) {
            $annotationNames = $this->getAnnotationNames();
        }

        return $annotationNames;
    }

    /**
     * @param $annotationTargets
     * @param $annotationNames
     * @return mixed|string[]
     * @throws Exception
     */
    public function normalizeTargets($annotationTargets, $annotationNames)
    {
        if (empty($annotationTargets)) {
            foreach ($annotationNames as $annotationName) {
                $annotationTargets = array_merge($annotationTargets, $this->getAnnotationTargets($annotationName));
            }

            $annotationTargets = array_unique($annotationTargets);
            if (empty($annotationTargets)) {
                $annotationTargets = self::ALL_TARGETS;
            }
        }

        asort($annotationTargets);
        return $annotationTargets;
    }

    public function warmUp(string $cacheDir): bool
    {
        $this->annotationTargets = $this->getCache("/Targets") ?? [];
        $this->classHierarchies = $this->getCache("/Hierarchies") ?? [];
        $this->classAncestors = $this->getCache("/Ancestors") ?? [];
        $this->classAnnotations = $this->getCache("/ClassAnnotations") ?? [];
        $this->methodAnnotations = $this->getCache("/MethodAnnotations") ?? [];
        $this->propertyAnnotations = $this->getCache("/PropertyAnnotations") ?? [];

        $this->executeOnce(function () {

            foreach ($this->classMetadataManipulator->getAllClassNames() as $className) {
                $this->getAncestor($className);
                $this->getAnnotations($className);
            }

            // Warmup controllers
            foreach ($this->router->getRouteCollection()->all() as $route) {
                $className = explode("::", $route->getDefaults()["_controller"] ?? "")[0] ?? "";
                if (!class_exists($className)) {
                    continue;
                }

                $this->getAncestor($className);
                $this->getAnnotations($className);
            }

            $this->commitCache();
        });

        return true;
    }

    /**
     * @param $classNameOrMetadataOrRefl
     * @param $annotationNames
     * @param array $annotationTargets
     * @return array|array[]
     * @throws Exception
     */
    public function getAnnotations($classNameOrMetadataOrRefl, $annotationNames = null, array $annotationTargets = []): array
    {
        // Termination
        if ($classNameOrMetadataOrRefl == null) {
            return [];
        }

        $reflClass = $this->getReflClass($classNameOrMetadataOrRefl);

        $annotations = [self::TARGET_CLASS => [], self::TARGET_METHOD => [], self::TARGET_PROPERTY => []];
        $annotationNames = $this->normalizeNames($annotationNames);
        $annotationTargets = $this->normalizeTargets($annotationTargets, $annotationNames);

        //
        // Class not yet visited.. determine parent class
        if (!array_key_exists($reflClass->getName(), $this->classHierarchies)) {
            $this->classHierarchies[$reflClass->getName()] = null;
            if (($parentClassName = get_parent_class($reflClass->getName()))) {
                $this->classHierarchies[$reflClass->getName()] = $parentClassName;
            }

            $this->setCache("/Hierarchies", $this->classHierarchies, null, true);
        }


        // Get class annotations
        if (in_array(self::TARGET_CLASS, $annotationTargets)) {
            $annotations[self::TARGET_CLASS][$reflClass->getName()] =
                $this->getClassAnnotations($reflClass, $annotationNames, $annotationTargets);
        }

        // Get method annotations
        if (in_array(self::TARGET_METHOD, $annotationTargets)) {
            $annotations[self::TARGET_METHOD][$reflClass->getName()] =
                $this->getMethodAnnotations($reflClass, $annotationNames, $annotationTargets);
        }

        // Get properties annotations
        if (in_array(self::TARGET_PROPERTY, $annotationTargets)) {
            $annotations[self::TARGET_PROPERTY][$reflClass->getName()] =
                $this->getPropertyAnnotations($reflClass, $annotationNames, $annotationTargets);
        }

        return $annotations;
    }
}
