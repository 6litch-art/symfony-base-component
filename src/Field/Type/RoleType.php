<?php

namespace Base\Field\Type;

use Base\Entity\User;
use Base\Field\Traits\SelectTypeInterface;
use Base\Field\Traits\SelectTypeTrait;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RoleType extends AbstractType implements SelectTypeInterface
{
    use SelectTypeTrait;

    public static function getChoices(): array
    {
        return [
            "Generics" => [

                "Super Administrator" => User::ROLE_SUPERADMIN,
                "Administrator" => User::ROLE_ADMIN,
                "User" => User::ROLE_USER
            ]
        ];
    }

    public static function getIcons(): array
    {
        return [
            User::ROLE_SUPERADMIN => "fas fa-fw fa-crown",
            User::ROLE_ADMIN => "fas fa-fw fa-star",
            User::ROLE_USER => "fas fa-fw fa-user",
        ];
    }

    public static function getAltIcons(): array
    {
        return [
            User::ROLE_SUPERADMIN => "fas fa-fw fa-user-cog",
            User::ROLE_ADMIN => "fas fa-fw fa-user-check",
            User::ROLE_USER => "fas fa-fw fa-tags",
        ];
    }

    public function configureOptions(OptionsResolver $resolver) {

        $resolver->setDefaults([
            'choices' => self::getChoices(),
            'choice_icons' => self::getIcons(),
            'empty_data'   => User::ROLE_USER,
            'invalid_message' => function (Options $options, $previousValue) {
                return ($options['legacy_error_messages'] ?? true)
                    ? $previousValue
                    : 'Please select a role.';
            }
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function getParent()
    {
        return SelectType::class;
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'role';
    }
}
