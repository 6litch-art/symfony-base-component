<?php

namespace Base\Entity\Sitemap\Widget;

use Base\Annotations\Annotation\DiscriminatorEntry;
use Base\Entity\Sitemap\Widget;
use Base\Model\IconizeInterface;
use Doctrine\ORM\Mapping as ORM;
use Base\Repository\Sitemap\Widget\MenuRepository;

/**
 * @ORM\Entity(repositoryClass=MenuRepository::class)
 * @DiscriminatorEntry( value = "menu" )
 */

class Menu extends Widget implements IconizeInterface
{
    public static function __iconize(): array { return ["fas fa-compass"]; } 
}