<?php

namespace Base\Field\Type;

use Base\Entity\Thread;
use Base\Field\Traits\SelectTypeInterface;
use Base\Field\Traits\SelectTypeTrait;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;

class StateType extends AbstractType implements SelectTypeInterface
{
    use SelectTypeTrait;

    public static function getChoices(): array
    {
        return [
            "Published" => Thread::STATE_PUBLISHED,
            "Draft"     => Thread::STATE_DRAFT,
            "Future"    => Thread::STATE_FUTURE,
            "Private"   => Thread::STATE_SECRET,

            "Approved"  => Thread::STATE_APPROVED,
            "Pending"   => Thread::STATE_PENDING,
            "Rejected"  => Thread::STATE_REJECTED,
            "Deleted"   => Thread::STATE_DELETED
        ];
    }

    public static function getIcons(): array
    {
        return [
            Thread::STATE_PUBLISHED => "fas fa-fw fa-eye",
            Thread::STATE_DRAFT     => "fas fa-fw fa-drafting-compass",
            Thread::STATE_FUTURE    => "fas fa-fw fa-spinner",
            Thread::STATE_SECRET    => "fas fa-fw fa-eye-slash",

            Thread::STATE_APPROVED  => "fas fa-fw fa-check-circle",
            Thread::STATE_PENDING   => "fas fa-fw fa-pause-circle",
            Thread::STATE_REJECTED  => "fas fa-fw fa-times-circle",
            Thread::STATE_DELETED   => "fas fa-fw fa-ban",
        ];
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'choices' => self::getChoices(),
            'choice_icons' => self::getIcons(),
            'empty_data'   => Thread::STATE_DRAFT,
            'invalid_message' => function (Options $options, $previousValue) {
                return ($options['legacy_error_messages'] ?? true)
                    ? $previousValue
                    : 'Please select a status.';
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
        return 'status';
    }
}