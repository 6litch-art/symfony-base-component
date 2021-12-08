<?php

namespace Base\Field\Configurator;

use Base\Annotations\Annotation\Uploader;
use Base\Field\AvatarField;
use Base\Service\BaseService;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldConfiguratorInterface;
use EasyCorp\Bundle\EasyAdminBundle\Dto\EntityDto;
use EasyCorp\Bundle\EasyAdminBundle\Dto\FieldDto;

class AvatarConfigurator implements FieldConfiguratorInterface
{
    public function supports(FieldDto $field, EntityDto $entityDto): bool
    {
        return AvatarField::class === $field->getFieldFqcn();
    }

    public function configure(FieldDto $field, EntityDto $entityDto, AdminContext $context): void
    {
        $field->setFormTypeOption("max_filesize", Uploader::getMaxFilesize($entityDto->getInstance(), $field->getProperty()));
        $field->setFormTypeOption("mime_types", Uploader::getMimeTypes($entityDto->getInstance(), $field->getProperty()));

        $file = Uploader::getPublicPath($entityDto->getInstance(), $field->getProperty()) ?? "";
        $field->setFormattedValue($file);
    }
}
