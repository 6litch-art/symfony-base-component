<?php

namespace Base\Controller\Backoffice;

use Base\Config\Extension;
use Base\Database\Factory\ClassMetadataManipulator;
use Base\Field\IdField;
use Base\Model\IconizeInterface;
use Base\Service\BaseService;
use Base\Service\TranslatorInterface;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\QueryBuilder;
use EasyCorp\Bundle\EasyAdminBundle\Collection\ActionCollection;
use EasyCorp\Bundle\EasyAdminBundle\Collection\EntityCollection;
use EasyCorp\Bundle\EasyAdminBundle\Collection\FieldCollection;
use EasyCorp\Bundle\EasyAdminBundle\Collection\FilterCollection;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Config\KeyValueStore;
use EasyCorp\Bundle\EasyAdminBundle\Dto\EntityDto;
use EasyCorp\Bundle\EasyAdminBundle\Dto\SearchDto;

use EasyCorp\Bundle\EasyAdminBundle\Provider\AdminContextProvider;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Component\HttpFoundation\RequestStack;

abstract class AbstractCrudController extends \EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController
{
    abstract static function getPreferredIcon(): ?string;

    /**
     * @var ClassMetadataManipulator
     */
    protected $classMetadataManipulator;

    /**
     * @var BaseService
     */
    protected $baseService;

    public function __construct(
        AdminContextProvider $adminContextProvider,
        AdminUrlGenerator $adminUrlGenerator,
        ClassMetadataManipulator $classMetadataManipulator,
        EntityManagerInterface $entityManager,
        RequestStack $requestStack,
        Extension $extension,
        TranslatorInterface $translator, BaseService $baseService)
    {
        $this->classMetadataManipulator = $classMetadataManipulator;

        $this->entityManager = $entityManager;
        $this->adminContextProvider  = $adminContextProvider;
        $this->requestStack = $requestStack;
        $this->extension = $extension;
        $this->translator = $translator;
        $this->adminUrlGenerator = $adminUrlGenerator;
        $this->baseService = $baseService;

        $this->crud = null;
    }

    public function getTranslator() { return $this->translator; }
    public function getDiscriminatorMap(): array
    {
        return $this->classMetadataManipulator->getDiscriminatorMap(get_called_class()::getEntityFqcn());
    }

    public static function getEntityFqcn(): string
    {
        $entityFqcn = mb_substr(get_called_class(), 0, -strlen("CrudController"));
        $entityFqcn = get_alias(preg_replace('/\\\Controller\\\Backoffice\\\Crud\\\/', "\\Entity\\", $entityFqcn));
        self::$crudController[$entityFqcn] = get_called_class();
        return $entityFqcn;
    }

    protected static array $crudController = [];
    public static function getCrudControllerFqcn($entity, bool $inheritance = false): ?string
    {
        $entityFqcn = is_object($entity) ? get_class($entity) : ($entity !== null && class_exists($entity) ? $entity : null);
        if($entityFqcn === null) return null;

        if(array_key_exists($entityFqcn, self::$crudController))
            return self::$crudController[$entityFqcn];

        $crudController = preg_replace('/\\\Entity\\\/', "\\Controller\\\Backoffice\\\Crud\\", $entityFqcn);
        $crudController = $crudController . "CrudController";
        if( false !== ($pos = strrpos($crudController, '\\__CG__\\')) )
            $crudController = mb_substr($crudController, $pos + 8);

        $appCrudController  = preg_replace("/^Base/", 'App', $crudController);
        $baseCrudController = preg_replace("/^App/", 'Base', $appCrudController);
        if(str_starts_with($crudController, "Base")) {

            if (class_exists($appCrudController) and !class_exists($crudController))
                return $appCrudController;
        }

        return (class_exists($appCrudController)  ? $appCrudController :
               (class_exists($baseCrudController) ? $baseCrudController : ($inheritance ? self::getCrudControllerFqcn(get_parent_class($entity)) : null)));
    }

    public static function getCrudTranslationPrefix()   { return "@".AbstractDashboardController::TRANSLATION_DASHBOARD.".".self::getTranslationPrefix("Crud\\"); }
    public static function getEntityTranslationPrefix() { return "@".AbstractDashboardController::TRANSLATION_ENTITY   .".".self::getTranslationPrefix(); }
    public static function getTranslationPrefix(?string $prefix = "")
    {
        $entityFqcn = preg_replace('/^(App|Base)\\\Entity\\\/', $prefix ?? "", get_called_class()::getEntityFqcn());
        return camel2snake(str_replace("\\", ".", $entityFqcn));
    }

    public function configureDiscriminatorMap(array $discriminatorMap, string $rootEntity, string $entity): ?array
    {
        return null;
    }

    protected $allowRootEntity = true;
    public function disallowRootEntity()
    {
        $this->allowRootEntity = true;
        return $this->allowRootEntity;
    }
    public function allowRootEntity()
    {
        $this->allowRootEntity = true;
        return $this;
    }

    public function setDiscriminatorMapAttribute(Action $action)
    {
        $entity     = get_alias($this->getEntityFqcn());
        $rootEntity = get_alias($this->classMetadataManipulator->getRootEntityName($entity));
        $actionDto = $action->getAsDto();

        $discriminatorMap = $this->configureDiscriminatorMap($this->classMetadataManipulator->getDiscriminatorMap($entity), $rootEntity, $entity);
        if ($discriminatorMap === null)
            $discriminatorMap = array_filter($this->classMetadataManipulator->getDiscriminatorMap($entity), fn($e) => is_instanceof($e, $entity));

        $htmlAttributes        = $actionDto->getHtmlAttributes();
        $htmlAttributes["crud"] = urlencode(get_class($this));
        $htmlAttributes["root-crud"] = urlencode($this->getCrudControllerFqcn($rootEntity));
        $htmlAttributes["map"] = [];

        foreach($discriminatorMap as $key => $class) {

            $class = get_alias($class);

            if(is_abstract($class)) continue;

            $k     = explode("_", $key);
            $key   = array_shift($k);

            if(( $crudClassController = $this->getCrudControllerFqcn($class) )) {

                $array = [implode("_", $k) => urlencode($crudClassController)];
                $htmlAttributes["map"][$key] = array_merge($htmlAttributes["map"][$key] ?? [], $array);
            }
        }

        if(count(array_filter($discriminatorMap, fn($e) => $e !== $entity)) > 0) {

            $actionDto->setHtmlElement("discriminator");
            $actionDto->setHtmlAttributes($htmlAttributes);
        }

        return $action;
    }

    public function configureActions(Actions $actions): Actions
    {
        return $actions
                ->update(Crud::PAGE_INDEX, Action::NEW ,    fn(Action $a) => $this->setDiscriminatorMapAttribute($a))
                ->setPermission(Action::NEW, 'ROLE_ADMIN')
                ->setPermission(Action::EDIT, 'ROLE_ADMIN')
                ->setPermission(Action::DELETE, 'ROLE_ADMIN');
    }

    public function configureExtension(Extension $extension) : Extension
    {
        return $extension;
    }

    public function getExtension():Extension { return $this->extension; }

    protected $crud = null;

    public function getCrud():Crud { return $this->crud; }

    protected $entityDto = null;
    public function getEntity() { return $this->entityDto ? $this->entityDto->getInstance() : null; }
    public function getEntityDto():EntityDto { return $this->entityDto; }
    public function getEntityCollection():EntityCollection { return $this->entityCollection; }

    public static function getEntityLabelInSingular() { return self::getEntityTranslationPrefix().".singular"; }
    public static function getEntityLabelInPlural() { return self::getEntityTranslationPrefix().".plural"; }
    public static function getEntityIcon()
    {
        $icon = get_called_class()::getPreferredIcon() ?? null;
        $entityFqcn = get_called_class()::getEntityFqcn();

        return $icon ?? (class_implements_interface($entityFqcn, IconizeInterface::class) ? $entityFqcn::__iconizeStatic()[0] : null);
    }

    public function configureCrud(Crud $crud): Crud
    {
        $this->crud = $crud;

        // Extra information configuration
        $entityLabelInSingular = $this->translator->trans(self::getEntityLabelInSingular());
        if($entityLabelInSingular == self::getEntityLabelInSingular()) $entityLabelInSingular = null;
        $crud->getAsDto()->setEntityLabelInSingular($entityLabelInSingular ?? "");

        $entityLabelInPlural = $this->translator->trans(self::getEntityLabelInPlural());
        if($entityLabelInPlural == self::getEntityLabelInPlural()) $entityLabelInPlural = null;
        $crud->getAsDto()->setEntityLabelInPlural($entityLabelInPlural ?? "");

        $crudTranslationPrefix = $this->getCrudTranslationPrefix();
        $action = $this->requestStack->getCurrentRequest()->query->get("crudAction") ?? "";
        $crudTranslationPrefixWithAction = $crudTranslationPrefix . ($action ? "." . $action : "");

        $title = $this->translator->trans($crudTranslationPrefixWithAction.".title");
        if($title == $crudTranslationPrefixWithAction.".title") $title = $this->translator->trans($crudTranslationPrefix.".title");
        if($title == $crudTranslationPrefix.".title") $title = $this->translator->trans($crudTranslationPrefix.".plural");
        if($title == $crudTranslationPrefix.".plural") $title = $entityLabelInPlural ?? camel2snake(class_basename($this->getEntityFqcn()), " ");

        $help = $this->translator->trans($crudTranslationPrefixWithAction.".help");
        if($help == $crudTranslationPrefixWithAction.".help") $help = $this->translator->trans($crudTranslationPrefix.".help");
        if($help == $crudTranslationPrefix.".help") $help = "";

        $text = $this->translator->trans($crudTranslationPrefixWithAction.".text");
        if($text == $crudTranslationPrefixWithAction.".text") $text = $this->translator->trans($crudTranslationPrefix.".text");
        if($text == $crudTranslationPrefix.".text") $text = "";

        $this->extension->setIcon($this->getEntityIcon() ?? "fas fa-question-circle");
        $this->extension->setTitle(mb_ucfirst($title));
        $this->extension->setHelp($help);
        $this->extension->setText($text);

        // Configure CRUD and extension
        return $this->configureExtension($this->extension)
                    ->configureCrud($crud)
                    ->showEntityActionsInlined(true)
                    ->setDefaultSort(['id' => 'DESC'])
                    ->setPaginatorPageSize(20)
                    ->setFormOptions(
                        ['validation_groups' => ['new' ]],
                        ['validation_groups' => ['edit']]
                    );
    }

    public function configureEntityCollectionWithResponseParameters(?EntityCollection $entityCollection, KeyValueStore $responseParameters): ?EntityCollection
    {
        foreach($entityCollection ?? [] as $entityDto) {

            $entityDto = $this->configureEntityDto($entityDto);

            $actions = $entityDto->getActions();
            foreach($actions ?? [] as $action) {

                $instance = $entityDto->getInstance();
                $crudController = $this->getCrudControllerFqcn($instance);

                $discriminatorValue = $this->classMetadataManipulator->getDiscriminatorValue($instance);
                if($crudController && $discriminatorValue) {

                    $url = $this->adminUrlGenerator
                            ->unsetAll()
                            ->setController($crudController)
                            ->setEntityId($instance->getId())
                            ->setAction($action->getName())
                            ->includeReferrer()
                            ->generateUrl();

                    $action->setLinkUrl($url);
                }
            }

            $actions = $this->configureActionsWithEntityDto($actions, $entityDto);
        }

        return $entityCollection;
    }

    public function configureExtensionWithResponseParameters(Extension $extension, KeyValueStore $responseParameters): Extension
    {
        $entity = $this->getEntity();
        if(!$entity) return $extension;

        $userClass = "user.".mb_strtolower(camel2snake(class_basename($entity)));
        $entityLabel = $this->translator->trans($userClass.".plural", [], AbstractDashboardController::TRANSLATION_ENTITY);
        if($entityLabel == $userClass.".plural") $entityLabel = null;
        else $extension->setTitle(mb_ucfirst($entityLabel));

        $entityLabel = $entityLabel ?? $this->getEntityLabelInSingular() ?? "";
        $entityLabel = !empty($entityLabel) ? mb_ucfirst($entityLabel) : "";

        if ($entity) {

            $class = str_replace(["Proxies\\__CG__\\", "App\\Entity\\", "Base\\Entity\\"], ["", "", "",], get_class($entity));
            $class = implode(".", array_map("camel2snake", explode("\\", $class)));

            $entityLabel = mb_ucfirst($this->translator->trans(mb_strtolower(camel2snake($class)).".singular", [], AbstractDashboardController::TRANSLATION_ENTITY));
            $extension->setTitle(mb_ucfirst($this->translator->trans(mb_strtolower(camel2snake($class)).".plural", [], AbstractDashboardController::TRANSLATION_ENTITY)));
        }

        if($this->getCrud()->getAsDto()->getCurrentAction() != "new") {
            $entityText = $entityLabel ." ID #".$entity->getId();
            $extension->setText($entityText);
        }

        return $extension;
    }

    public function configureActionsWithEntityDto(ActionCollection $actions, EntityDto $entityDto): ActionCollection
    {
        return $actions;
    }

    public function configureEntityDto(EntityDto $entityDto): EntityDto
    {
        return $entityDto;
    }

    public function configureResponseParameters(KeyValueStore $responseParameters): KeyValueStore
    {
        $this->entityDto        = $responseParameters->get("entity");

        $this->entityCollection = $responseParameters->get("entities");
        $this->entityCollection = $this->configureEntityCollectionWithResponseParameters(
            $this->entityCollection,
            $responseParameters
        );

        $this->entityCollection = $responseParameters->set("entities", $this->entityCollection);
        if($this->entityCollection)
            $this->responseParameters->set("entities", $this->entityCollection);

        $this->extension = $this->configureExtensionWithResponseParameters($this->extension, $responseParameters);
        return parent::configureResponseParameters($responseParameters);
    }

    public function configureFields(string $pageName, ...$args): iterable
    {
        array_prepend($args, fn() => yield IdField::new());

        $yields = $this->yield($args);
        $simpleYields      = array_filter_recursive(array_filter($yields, fn($k) => preg_match("/^[0-9.]+$/", $k), ARRAY_FILTER_USE_KEY));
        $associativeYields = array_diff_key($yields, $simpleYields);
        $simpleYields      = array_values($simpleYields);

        $yields = [];
        foreach($simpleYields as $_) foreach($_ as $yield)
            $yields[] = $yield;

        $restYields = [];
        foreach($associativeYields as $path => $_) foreach($_ as $i => $yield) {

            $property = preg_replace("/^[0-9.]+/", "", $path);

            $yieldList = array_map(fn($y) => $y->getAsDto()->getProperty(), $yields);
            $yieldPos  = array_search($property, $yieldList);

            $yieldPosNext = next_key($yieldList, $yieldPos);
            $yieldPosNext = $yieldPosNext === false ? false : $yieldPosNext+$i;
            $yields = array_insert($yields, $yieldPosNext, $yield);
        }

        foreach(array_flatten(".", array_concat($yields, $restYields), -1, ARRAY_FLATTEN_PRESERVE_KEYS) ?? [] as $yield)
            yield $yield;
    }

    public function yield(array &$args, ?string $field = null): array
    {
        $args = array_map_recursive(
                fn($v) => is_callable($v) ? $v() : $v,
                array_flatten(".", array_filter_recursive($args,
                    fn($v, $k) => ($field === null || $k == $field) && !empty($v),
                    ARRAY_FILTER_USE_BOTH)
                , -1, ARRAY_FLATTEN_PRESERVE_KEYS)
            );

        $yields = [];
        foreach($args as $field2 => $yield)
            if($field === null || $field == $field2) $yields[$field2] = $yield;

        return $yields;
    }

    public function configureFilters(Filters $filters): Filters
    {
        return $filters;
    }

    public function createIndexQueryBuilder(SearchDto $searchDto, EntityDto $entityDto, FieldCollection $fields, FilterCollection $filters): QueryBuilder
    {
        return parent::createIndexQueryBuilder($searchDto, $entityDto, $fields, $filters);
    }
}
