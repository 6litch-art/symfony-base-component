<?php

namespace Base\Twig\Extension;

use Base\Service\Breadgrinder;
use Twig\Environment;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

final class BreadgrinderTwigExtension extends AbstractExtension
{
    public function __construct(Breadgrinder $breadgrinder) { $this->breadgrinder = $breadgrinder; }

    public function getName() { return 'breadcrumb_extension'; }
    public function getFunctions() : array
    {
        return [
            new TwigFunction('render_breadcrumb', [$this, 'renderBreadcrumb'], ["needs_environment" => true, 'is_safe' => ['all']]),
        ];
    }

    public function renderBreadcrumb(Environment $twig, string $name, array $options = []): ?string
    {
        $breadcrumb = $this->breadgrinder->grind($name, $options);
        $breadcrumb->compute();
        
        if($breadcrumb === null) 
            throw new \Exception("Breadcrumb \"$name\" not found in the grinder machine.");

        return $twig->render($breadcrumb->getTemplate(), ["breadcrumb" => $breadcrumb]);
    }
}
