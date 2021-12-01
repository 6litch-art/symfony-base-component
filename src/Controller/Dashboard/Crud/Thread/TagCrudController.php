<?php

namespace Base\Controller\Dashboard\Crud\Thread;

use Base\Controller\Dashboard\AbstractCrudController;

use Base\Field\ImpersonateField;
use Base\Field\LinkIdField;

class TagCrudController extends AbstractCrudController
{
    public static function getPreferredIcon() { return "fas fa-tags"; } 
}