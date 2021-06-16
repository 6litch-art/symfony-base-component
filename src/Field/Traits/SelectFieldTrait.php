<?php

namespace Base\Field\Traits;

trait SelectFieldTrait {

    public function allowMultipleChoices(bool $allow = true): self
    {
        $this->setCustomOption(self::OPTION_ALLOW_MULTIPLE_CHOICES, $allow);
        return $this;
    }

    public function setChoices($choiceGenerator): self
    {
        if (!\is_array($choiceGenerator) && !\is_callable($choiceGenerator))
            throw new \InvalidArgumentException(sprintf('The argument of the "%s" method must be an array or a closure ("%s" given).', __METHOD__, \gettype($choiceGenerator)));

        $this->setCustomOption(self::OPTION_CHOICES, $choiceGenerator);
        return $this;
    }

    public function setFilter(array $filter)
    {
        $this->setCustomOption(self::OPTION_FILTER, $filter);
        return $this;
    }

    public function setIcons(array $icons)
    {
        $this->setCustomOption(self::OPTION_ICONS, $icons);
        return $this;
    }

    public function setDefault($defaultChoices)
    {
        if(!is_array($defaultChoices))
            $defaultChoices = [$defaultChoices];

        $this->setCustomOption(self::OPTION_DEFAULT_CHOICE, $defaultChoices);
        return $this;
    }
}
