<?php

namespace Base\Validator;

/**
 * @Annotation
 */
abstract class ConstraintEntity extends Constraint
{
    public $fields = [];
    public $entity = null;

    /**
     * {@inheritdoc}
     *
     * @param array|string $fields the combination of fields that must contain values or a set of options
     */
    public function __construct(
        $fields,
        array $options = [],
        array $groups = null,
        $payload = null
    ) {
        if (\is_array($fields) && \is_string(key($fields))) {
            $options = array_merge($fields, $options);
        } elseif (null !== $fields) {
            $options['fields'] = $fields;
        }

        if (empty($this->message)) {

            $constraintName = explode("\\", get_called_class());
            $constraintName = preg_replace('/Entity$/', '', array_pop($constraintName));
            $firstField = $fields['fields'][0] ?? "unknown";

            $this->message = 
                camel_to_snake($firstField) .".".
                camel_to_snake($constraintName);
        }

        parent::__construct($options, $groups, $payload);
    }

    public function setEntity($entity)
    {
        $this->entity = $entity;

        $classname = explode("\\", get_class($this->entity));
        $classname = array_pop($classname);

        $firstField = $this->fields[0] ?? "unknown";

        $constraintName = explode("\\", get_called_class());
        $constraintName = preg_replace('/Entity$/', '', array_pop($constraintName));
        $this->message = 
            camel_to_snake($classname).".".
            camel_to_snake($firstField).".".
            camel_to_snake($constraintName);
    }

    public function getRequiredOptions() : array
    {
        return ['fields'];
    }
    public function getDefaultOption() : ?string
    {
        return 'fields';
    }

    /**
     * {@inheritdoc}
     */
    public function getTargets() : string|array
    {
        return self::CLASS_CONSTRAINT;
    }
}