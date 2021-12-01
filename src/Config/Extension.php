<?php

namespace Base\Config;

use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use Twig\Environment;

class Extension
{
    public const PAGE_DEFAULT = "default";
    public const PAGE_INDEX   = Crud::PAGE_INDEX;
    public const PAGE_EDIT    = Crud::PAGE_EDIT;
    public const PAGE_NEW     = Crud::PAGE_NEW;

    public function __construct(Environment $twig)
    {
        $this->twig = $twig;
        $this->twig->addGlobal("ea_extra", $this);
    }

    protected function getFallback(string $varname, ?string $pageName = null)
    {
        $pageName = $pageName ?? self::PAGE_DEFAULT;
        return $this->{$varname}[$pageName] ?? $this->{$varname}[self::PAGE_DEFAULT] ?? null;
    }

    public function getPageTitle(?string $pageName = null): ?string { return $this->getFallback("title", $pageName); }
    public function setPageTitle($title, ?string $pageName = null) { return $this->setTitle($title, $pageName); }
    public function getTitle    (?string $pageName = null): ?string { return $this->getFallback("title", $pageName); }
    public function setTitle($title, ?string $pageName = null)
    {
        $this->title[$pageName ?? self::PAGE_DEFAULT] = $title;
        return $this;
    }

    public function getHelp(?string $pageName = null): ?string { return $this->getFallback("help", $pageName); }
    public function setHelp(string $help, ?string $pageName = null)
    {
        $this->help[$pageName ?? self::PAGE_DEFAULT] = $help;
        return $this;
    }

    public function getText(?string $pageName = null): ?string { return $this->getFallback("text", $pageName); }
    public function setText(string $text, ?string $pageName = null)
    {
        $this->text[$pageName ?? self::PAGE_DEFAULT] = $text;
        return $this;
    }

    public function getIcon(?string $pageName = null): ?string { return $this->getFallback("icon", $pageName); }
    public function setIcon(string $icon, ?string $pageName = null)
    {
        $this->icon[$pageName ?? self::PAGE_DEFAULT] = $icon;
        return $this;
    }

    public function getWidgets(?string $pageName = null): ?array { return $this->getFallback("widgets", $pageName); }
    public function setWidgets(array $widgets, ?string $pageName = null)
    {
        $this->widgets[$pageName ?? self::PAGE_DEFAULT] = $widgets;
        return $this;
    }
    
    public function configureDashboard(Dashboard $dashboard) { return $dashboard; }
    public function configureCrud(Crud $crud)
    {
        $actions = [self::PAGE_NEW, self::PAGE_EDIT, self::PAGE_INDEX];
        foreach($actions as $action) {
            $crud->setPageTitle($action, $this->getPageTitle($action) ?? "");
            $crud->setHelp($action, $this->getHelp($action) ?? "");
        }

        return $crud;
    }
}