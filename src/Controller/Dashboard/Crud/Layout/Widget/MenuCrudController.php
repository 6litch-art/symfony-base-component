<?php

namespace Base\Controller\Dashboard\Crud\Layout\Widget;

use Base\Annotations\Annotation\Slugify;
use Base\Field\TranslationField;

use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Base\Controller\Dashboard\AbstractCrudController;
use Base\Controller\Dashboard\Crud\Layout\WidgetCrudController;
use Base\Field\SelectField;
use Base\Field\SlugField;

class MenuCrudController extends WidgetCrudController
{
    public static function getPreferredIcon(): ?string { return null; } 

    public function configureFields(string $pageName, array $callbacks = []): iterable
    {
        $defaultCallback = function() { return []; };
        return parent::configureFields($pageName, [
            "id" => function () use ($defaultCallback, $callbacks, $pageName) {

                yield SelectField::new('widgets')->turnVertical();
                foreach ( ($callbacks["widgets"] ?? $defaultCallback)() as $yield)
                    yield $yield;

                yield SlugField::new('path')->setSeparator("-")->setTargetFieldName("translations.title");
                foreach ( ($callbacks["path"] ?? $defaultCallback)() as $yield)
                    yield $yield;
    
                yield TranslationField::new()->showOnIndex('title');
                foreach ( ($callbacks["title"] ?? $defaultCallback)() as $yield)
                    yield $yield;
        }]);
    }
}