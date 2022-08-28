<?php

namespace Base\Entity\Attribute\Scope;

use Base\Database\Annotation\DiscriminatorEntry;
use Base\Entity\Layout\Attribute\Adapter\AbstractAdapter;

use Doctrine\ORM\Mapping as ORM;
use Base\Repository\Attribute\Scope\TagScopeRepository;
use Base\Entity\Thread\Tag;
use Base\Field\Type\SelectType;

/**
 * @ORM\Entity(repositoryClass=TagScopeRepository::class)
 * @DiscriminatorEntry( value = "scope_tag" )
 */

class TagScope extends AbstractAdapter
{
    public static function __iconizeStatic() : ?array { return Tag::__iconizeStatic(); }

    public static function getType(): string { return SelectType::class; }
    public function getOptions(): array { return []; }

    public function resolve(mixed $value): mixed { return $value; }
}
