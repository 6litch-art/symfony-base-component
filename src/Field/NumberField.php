<?php

namespace Base\Field;

use Base\Field\Type\NumberType;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldInterface;
use EasyCorp\Bundle\EasyAdminBundle\Field\FieldTrait;

final class NumberField implements FieldInterface
{
    use FieldTrait;

    public const OPTION_MINIMUM = 'min';
    public const OPTION_MAXIMUM = 'max';
    public const OPTION_SUFFIX = 'suffix';
    public const OPTION_PREFIX = 'prefix';

    public const OPTION_NUM_DECIMALS = 'numDecimals';
    public const OPTION_ROUNDING_MODE = 'roundingMode';
    public const OPTION_STORED_AS_STRING = 'storedAsString';
    /**
     * @param string|false|null $label
     */
    public static function new(string $propertyName, $label = null): self
    {
        return (new self())
            ->setProperty($propertyName)
            ->setLabel($label)
            ->setTemplateName('crud/field/number')
            ->setTemplatePath('@EasyAdmin/crud/field/number.html.twig')
            ->setFormType(NumberType::class)
            ->addCssClass('field-number')
            ->setDefaultColumns(3)
            ->throttle(50)->step(1)
            ->setCustomOption(self::OPTION_NUM_DECIMALS, null)
            ->setCustomOption(self::OPTION_ROUNDING_MODE, \NumberFormatter::ROUND_HALFUP)
            ->setCustomOption(self::OPTION_STORED_AS_STRING, false);
    }

    public function percentage(int $min, int $max): self
    {
        return $this->setMinimum($min)->setMaximum($max)->setSuffix("%");
    }
    public function setNumDecimals(int $num): self
    {
        if ($num < 0) {
            throw new \InvalidArgumentException(sprintf('The argument of the "%s()" method must be 0 or higher (%d given).', __METHOD__, $num));
        }

        $this->setCustomOption(self::OPTION_NUM_DECIMALS, $num);
        return $this;
    }

    public function setMinimum(int $num): self
    {
        $this->setFormTypeOption(self::OPTION_MINIMUM, $num);
        return $this;
    }
    public function setMaximum(int $num): self
    {
        $this->setFormTypeOption(self::OPTION_MAXIMUM, $num);
        return $this;
    }
    public function setSuffix(string $suffix): self
    {
        $this->setFormTypeOption(self::OPTION_SUFFIX, $suffix);
        return $this;
    }
    public function setPrefix(int $prefix): self
    {
        $this->setFormTypeOption(self::OPTION_PREFIX, $prefix);
        return $this;
    }

    public function step(float $step) { return $this->stepUp($step)->stepDown($step); }
    public function stepUp(float $stepUp)
    {
        $this->setFormTypeOption("stepUp", $stepUp);
        return $this;
    }
    public function stepDown(float $stepDown)
    {
        $this->setFormTypeOption("stepDown", $stepDown);
        return $this;
    }

    public function throttle(float $throttle) { return $this->throttleUp($throttle)->throttleDown($throttle); }
    public function throttleUp(float $throttleUp)
    {
        $this->setFormTypeOption("throttleUp", $throttleUp);
        return $this;
    }
    public function throttleDown(float $throttleDown)
    {
        $this->setFormTypeOption("throttleDown", $throttleDown);
        return $this;
    }

    public function setRoundingMode(int $mode): self
    {
        $validModes = [
            'ROUND_DOWN' => \NumberFormatter::ROUND_DOWN,
            'ROUND_FLOOR' => \NumberFormatter::ROUND_FLOOR,
            'ROUND_UP' => \NumberFormatter::ROUND_UP,
            'ROUND_CEILING' => \NumberFormatter::ROUND_CEILING,
            'ROUND_HALF_DOWN' => \NumberFormatter::ROUND_HALFDOWN,
            'ROUND_HALF_EVEN' => \NumberFormatter::ROUND_HALFEVEN,
            'ROUND_HALF_UP' => \NumberFormatter::ROUND_HALFUP,
        ];

        if (!\in_array($mode, $validModes, true)) {
            throw new \InvalidArgumentException(sprintf('The argument of the "%s()" method must be the value of any of the following constants from the %s class: %s.', __METHOD__, \NumberFormatter::class, implode(', ', array_keys($validModes))));
        }

        $this->setCustomOption(self::OPTION_ROUNDING_MODE, $mode);

        return $this;
    }

    public function setStoredAsString(bool $asString = true): self
    {
        $this->setCustomOption(self::OPTION_STORED_AS_STRING, $asString);

        return $this;
    }
}
