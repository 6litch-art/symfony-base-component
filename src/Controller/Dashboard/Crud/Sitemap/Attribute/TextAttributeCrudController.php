<?php

namespace Base\Controller\Dashboard\Crud\Sitemap\Attribute;

use Base\Controller\Dashboard\Crud\Sitemap\AttributeCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class TextAttributeCrudController extends AttributeCrudController
{
    public static function getPreferredIcon(): ?string { return null; } 

    public function configureFields(string $pageName, array $callbacks = []): iterable
    {
        return parent::configureFields($pageName, array_merge($callbacks, [
            "id" => function () {
                yield NumberField::new('length');
                yield TextField::new('value');
            },
        ]));
    }
}
