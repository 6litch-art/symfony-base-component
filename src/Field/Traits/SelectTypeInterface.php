<?php

namespace Base\Field\Traits;

interface SelectTypeInterface
{
    public static function getChoices(): array;
    public static function getIcons(): array;
}