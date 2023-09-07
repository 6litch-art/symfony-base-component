<?php

namespace Base\Field\Type;

use Base\Annotations\Annotation\Uploader;
use Base\Controller\Backend\AbstractCrudController;
use Base\Database\Mapping\ClassMetadataManipulator;
use Base\Database\Entity\EntityHydrator;
use Base\Enum\UserRole;
use Base\Form\FormFactory;
use Base\Service\FileService;
use Base\Service\MediaService;
use Base\Traits\BaseTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\PersistentCollection;
use Doctrine\Persistence\Mapping\MappingException;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Exception;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\DataMapperInterface;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\PropertyAccess\PropertyAccess;
use Symfony\Component\PropertyAccess\PropertyAccessor;
use Traversable;

/**
 *
 */
class AssociationFileType extends AbstractType implements DataMapperInterface
{
    use BaseTrait;

    /**
     * @var ClassMetadataManipulator|null
     */
    protected ?ClassMetadataManipulator $classMetadataManipulator = null;

    /**
     * @var FormFactory|null
     */
    protected ?FormFactory $formFactory = null;


    /**
     * @var FileService
     */
    protected mixed $fileService = null;

    /**
     * @var EntityHydrator|null
     */
    protected ?EntityHydrator $entityHydrator = null;

    /**
     * @var MediaService|null
     */
    protected ?MediaService $mediaService = null;

    /**
     * @var PropertyAccessor|null
     */
    protected ?PropertyAccessor $propertyAccessor = null;

    /**
     * @var AdminUrlGenerator|null
     */
    protected ?AdminUrlGenerator $adminUrlGenerator = null;

    public function getBlockPrefix(): string
    {
        return 'associationfile';
    }

    public function __construct(FormFactory $formFactory, ClassMetadataManipulator $classMetadataManipulator, EntityHydrator $entityHydrator, MediaService $mediaService)
    {
        $this->formFactory = $formFactory;
        $this->classMetadataManipulator = $classMetadataManipulator;
        $this->entityHydrator = $entityHydrator;

        $this->mediaService = $mediaService;
        $this->fileService = cast($mediaService, FileService::class);

        $this->propertyAccessor = PropertyAccess::createPropertyAccessor();
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'class' => null,
            'form_type' => FileType::class,

            'entity_file' => null,
            'entity_data' => [],

            "multiple" => null,
            'allow_delete' => false,
            "allow_delete[confirmation]" => true,

            'href' => null,

            'max_size' => null,
            'max_files' => null,
            'mime_types' => null,
            'sortable' => null
        ]);

        $resolver->setNormalizer('data_class', function (Options $options, $value) {
            if ($options["multiple"]) {
                return null;
            }
            return $value ?? null;
        });

        $resolver->setNormalizer('form_type', function (Options $options, $value) {
            if (is_instanceof($value, FileType::class)) {
                return $value;
            }
            if (is_instanceof($value, ImageType::class)) {
                return $value;
            }
            if (is_instanceof($value, AvatarType::class)) {
                return $value;
            }
            throw new Exception("Option \"form_type\" must inherit from FileType");
        });

        $resolver->setNormalizer('class', function (Options $options, $value) {
            if ($value === null) {
                throw new Exception("Option \"class\" must be defined");
            }
            return $value;
        });

        $resolver->setNormalizer('entity_file', function (Options $options, $value) {
            if ($value === null) {
                throw new Exception("Option \"entity_file\" must be pointing to the file field");
            }
            return $value;
        });
    }

    public function finishView(FormView $view, FormInterface $form, array $options): void
    {
        //
        // Set controller url
        $options["class"] = $this->formFactory->guessClass($form, $options);
        $options["multiple"] = $this->formFactory->guessMultiple($form, $options);
        $options["sortable"] = $this->formFactory->guessSortable($form, $options);

        $parentForm = $form->getParent();
        $dataClass = $parentForm ? $this->formFactory->guessClass($parentForm, $parentForm->getConfig()->getOptions()) : null;
        $isNullable = $dataClass ? $this->classMetadataManipulator->getMapping($dataClass, $form->getName())["nullable"] ?? false : false;
        $crudController = AbstractCrudController::getCrudControllerFqcn($options["class"]);

        $href = null;
        if ($options["href"] === null && $crudController && $this->getService()->isGranted(UserRole::ADMIN)) {
            $href = $this->adminUrlGenerator
                ->unsetAll()
                ->setController($crudController)
                ->setAction(Action::EDIT)
                ->setEntityId("{0}")
                ->generateUrl();
        }

        $view->vars["href"] = $options["href"] ?? $href;
        $view->vars["multiple"] = $options["multiple"];
        $view->vars["allow_delete"] = $options["allow_delete"];

        $view->vars["required"] = $options["required"] ?? (!$isNullable && !$this->classMetadataManipulator->isToManySide($dataClass, $form->getName()));

        $data = $form->getData();
        $view->vars["entityId"] = json_encode(array_transforms(function ($k, $e) use ($options, $form): array {
            $path = PropertyAccess::createPropertyAccessor()->getValue($e, $options["entity_file"]);
            if ($path instanceof Collection) {
                $path = $path->toArray();
            }

            $path = is_array($path) ? begin($path) ?? null : $path;
            return $path === null ? [] : [basename($path), $e->getId()];
        }, ($data instanceof Collection) ? $data->toArray() : []));
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->setDataMapper($this);
        $builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) use ($options) {
            $form = $event->getForm();
            $data = $event->getData();

            $options["class"] = $this->formFactory->guessClass($event, $options);
            $options["multiple"] = $this->formFactory->guessMultiple($event, $options);
            $options["sortable"] = $this->formFactory->guessSortable($event, $options);

            $fieldName = explode(".", $options["entity_file"] ?? "");
            $baseName = first($fieldName);
            $fieldName = implode(".", $fieldName);

            $parentForm = $form->getParent();
            $dataClass = $parentForm ? $this->formFactory->guessClass($parentForm, $parentForm->getConfig()->getOptions()) : null;
            $isNullable = $dataClass ? $this->classMetadataManipulator->getMapping($dataClass, $form->getName())["nullable"] ?? false : false;

            $form->add($baseName, $options["form_type"], [
                'class' => $options["class"],
                'allow_delete' => $options["allow_delete"],
                'required' => !$isNullable,
                'multiple' => $options["multiple"] ?? false,
                'href' => $options["href"] ?? null,
                'max_size' => $options["max_size"],
                'max_files' => $options["max_files"],
                'mime_types' => $options["mime_types"],
                'sortable' => $options["sortable"]
            ]);

            if ($options["multiple"]) {
                $data ??= new ArrayCollection();
            }

            $files = array_filter(array_map(function ($e) use ($fieldName) {
                $public = Uploader::getPublic($e, $fieldName);
                return is_array($public) ? begin($public) ?? null : $public;
            }, $options["multiple"] ? $data->toArray() : [$data]));

            $form->get($baseName)->setData($files);
        });
    }

    /**
     * @param $viewData
     * @param Traversable $forms
     * @return void
     */
    public function mapDataToForms($viewData, Traversable $forms): void
    {
    }

    /**
     * @param Traversable $forms
     * @param $viewData
     * @return void
     * @throws MappingException
     */
    public function mapFormsToData(Traversable $forms, &$viewData): void
    {
        $parentForm = current(iterator_to_array($forms))->getParent();
        if ($parentForm?->getData() instanceof PersistentCollection &&
            $this->classMetadataManipulator->isCollectionOwner($parentForm, $parentForm?->getData()) === false) {
            return;
        }

        $parentEntity = $parentForm->getParent() ? $parentForm->getParent()->getData() : null;

        $options = $parentForm->getConfig()->getOptions();
        $options["data_class"] = $options["data_class"] ?? $this->formFactory->guessClass($parentForm, $options);
        $options["multiple"] = $options["multiple"] ?? $this->formFactory->guessMultiple($parentForm, $options);

        $classMetadata = $this->classMetadataManipulator->getClassMetadata($options["data_class"]);
        if (!$classMetadata) {
            throw new Exception("Entity \"" . $options['data_class'] . "\" not found.");
        }

        $newData = new ArrayCollection();

        $fieldName = explode(".", $options["entity_file"] ?? "");
        $baseName = first($fieldName);
        $fieldName = implode(".", $fieldName);

        $form = iterator_to_array($forms)[$baseName] ?? null;
        if ($form) {
            $viewDataFileIndexes = [];
            if ($viewData instanceof Collection) {
                $viewDataFileIndexes = $viewData->map(function ($e) use ($fieldName) {
                    $value = $this->propertyAccessor->getValue($e, $fieldName);
                    return basename(is_array($value) ? first($value) : $value);
                })->toArray();
            }

            if ($options["multiple"]) {
                foreach ($form->getData() ?? [] as $file) {
                    $entity = null;
                    if ($file instanceof File) {
                        $entity = $this->entityHydrator->hydrate($options["data_class"], [], ["uuid", "translations"], EntityHydrator::CONSTRUCT);
                    } elseif (($pos = array_search($file, $viewDataFileIndexes)) !== false) {
                        $entity = $viewData[$pos];
                    }

                    if ($entity !== null) {
                        if ($options["entity_data"] ?? false) {
                            if (is_callable($options["entity_data"])) {
                                $entity = $options["entity_data"]($entity, $parentEntity, $file) ?? $entity;
                            } else {
                                $entity = $this->entityHydrator->hydrate($entity, array_merge($options["entity_data"] ?? [], [$fieldName => $file]), [], EntityHydrator::CONSTRUCT);
                            }
                        } elseif ($entity->getId() === null) {
                            $this->propertyAccessor->setValue($entity, $fieldName, $file);
                        }

                        $newData[] = $entity;
                    }
                }
            } elseif (($file = $form->getData())) {
                $entity = $viewData;
                if (!$entity) {
                    $entity = $this->entityHydrator->hydrate($options["data_class"], [], ["uuid", "translations"], EntityHydrator::CONSTRUCT);
                }

                if (is_callable($options["entity_data"])) {
                    $entity = $options["entity_data"]($entity, $parentEntity, $file);
                } else {
                    $entity = $this->entityHydrator->hydrate($entity, array_merge($options["entity_data"] ?? [], [$fieldName => $file]), [], EntityHydrator::CONSTRUCT);
                }

                $newData[] = $entity;
            }

            if ($options["multiple"]) {
                if ($viewData instanceof PersistentCollection) {
                    $mappedBy = $viewData->getMapping()["mappedBy"];
                    $fieldName = $viewData->getMapping()["fieldName"];
                    $isOwningSide = $viewData->getMapping()["isOwningSide"];

                    if (!$isOwningSide) {
                        foreach ($viewData as $entry) {
                            $this->propertyAccessor->setValue($entry, $mappedBy, null);
                        }
                    }

                    $viewData->clear();
                    foreach ($newData as $entry) {
                        $viewData->add($entry);
                        if (!$isOwningSide) {
                            $this->propertyAccessor->setValue($entry, $mappedBy, $viewData->getOwner());
                        }
                    }
                } else {
                    $viewData = $newData;
                }
            } elseif ($newData->first()) {
                $viewData = $newData->first();
            }
        }
    }
}
