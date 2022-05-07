<?php

namespace Base\Entity\Layout\Widget;

use App\Enum\UserRole;
use Base\Database\Annotation\DiscriminatorEntry;
use Base\Entity\Layout\Widget;
use Base\Model\IconizeInterface;
use Base\Model\UrlInterface;
use Doctrine\ORM\Mapping as ORM;
use Base\Repository\Layout\Widget\RouteRepository;

/**
 * @ORM\Entity(repositoryClass=RouteRepository::class)
 * @DiscriminatorEntry
 * 
 * @ORM\Cache(usage="NONSTRICT_READ_WRITE") 
 */

class Route extends Widget implements IconizeInterface, UrlInterface
{
    public        function __iconize()       : ?array { return $this->getRouteIcons(); } 
    public static function __iconizeStatic() : ?array { return ["fas fa-road"]; } 

    public function __toUrl(): ?string { return $this->generate(); }
    public function __toString() { return $this->getTitle(); }
    
    public function __construct(?string $title = null, ?string $routeName = null, array $routeParameters = []) 
    {
        parent::__construct($title);
        
        $this->routeName = $routeName;
        $this->routeParameters = $routeParameters;
    }
    
    /**
     * @ORM\Column(type="text")
     */
    protected $routeName;
    public function getRouteName(): ?string { return $this->routeName; }
    public function setRouteName(?string $routeName): self
    {
        $this->routeName = $routeName;
        return $this;
    }

    /**
     * @ORM\Column(type="array", nullable=true)
     */
    protected $routeParameters;
    public function getRouteParameters(): ?array { return $this->routeParameters; }
    public function setRouteParameters(?array $routeParameters): self
    {
        $this->routeParameters = $routeParameters;
        return $this;
    }

    public function getPath() 
    {
        $route = $this->getRouter()->getRouteCollection()->get($this->routeName);
        return $route ? $route->getPath() : null;
    }

    public function getRoute(): ?string { return $this->getRouter()->getRoute($this->getUrl()); }
    public function getRouteIcons() { return $this->getIconProvider()->getRouteIcons($this->routeName); }
    public function getUrl(): ?string { return $this->generate(); }

    public function generate(): ?string
    {
        try { return $this->getRouter()->generate($this->routeName, $this->routeParameters ?? []); }
        catch (\Exception $e) { }

        return null;
    }
}
