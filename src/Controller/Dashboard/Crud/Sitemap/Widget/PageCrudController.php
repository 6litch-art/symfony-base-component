<?php

namespace Base\Controller\Dashboard\Crud\Sitemap\Widget;

use Base\Field\ImageField;
use Base\Field\TranslatableField;
use Base\Field\SlugField;

use Base\Controller\Dashboard\AbstractCrudController;

class PageCrudController extends AbstractCrudController
{
    public static function getPreferredIcon() { return "fas fa-file-alt"; } 

    public function configureFields(string $pageName, array $callbacks = []): iterable
    {
        $defaultCallback = function() { return []; };

        yield ImageField::new('thumbnail');
        yield SlugField::new('slug')->setTargetFieldName("translations.title");

        yield TranslatableField::new()->showOnIndex('title');
        foreach ( ($callbacks["title"] ?? $defaultCallback)() as $yield)
            yield $yield;
    }
}