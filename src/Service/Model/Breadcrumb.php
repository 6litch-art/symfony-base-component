<?php

namespace Base\Service\Model;

use ArrayAccess;
use Base\Annotations\Annotation\Iconize;
use Base\Annotations\AnnotationReader;
use Base\Service\TranslatorInterface;
use Countable;
use Iterator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use Symfony\Component\Routing\RouterInterface;

class Breadcrumb implements BreadcrumbInterface, Iterator, Countable, ArrayAccess
{
    protected bool $computed = false;
    protected array $items   = [];
    protected array $options = [];
    protected $request = null;

    protected $router = null;
    protected $template = "@Base/breadcrumb/default.html.twig";

    protected $iterator  = 0;

    public function offsetExists(mixed $offset): bool
    {
        return isset($this->items[$offset]);
    }
    public function offsetUnset(mixed $offset): void
    {
        $this->removeItem($offset);
    }
    public function offsetGet(mixed $offset): mixed
    {
        return $this->getItem($offset);
    }
    public function offsetSet(mixed $offset, mixed $value = []): void
    {
        if (is_null($offset)) {
            $this->prependItem(...$value);
        } else {
            $this->prependItem($offset, ...$value);
        }
    }

    public function count(): int
    {
        return $this->getLength();
    }
    public function rewind(): void
    {
        $this->iterator = 0;
    }
    public function next(): void
    {
        $this->iterator++;
    }
    public function key(): mixed
    {
        return $this->iterator;
    }
    public function valid(): bool
    {
        return $this->getLength() > $this->iterator;
    }
    public function current(): mixed
    {
        return $this->getItem($this->iterator);
    }

    /**
     * @var TranslatorInterface
     */
    protected $translator;

    /**
     * @var AnnotationReader
     */
    protected $annotationReader;

    public function __construct(RouterInterface $router, TranslatorInterface $translator, array $options = [], ?string $template = null)
    {
        $this->router = $router;
        $this->translator = $translator;
        $this->options = $options;

        $this->annotationReader = AnnotationReader::getInstance();
        if ($template) {
            $this->template = $template;
        }
    }

    public function getRequest(): ?Request
    {
        return $this->request;
    }
    public function setRequest(Request $request): self
    {
        $this->request = $request;
        return $this;
    }

    public function compute(?Request $request = null)
    {
        if ($this->computed) {
            return $this;
        }

        $request = $request ?? $this->getRequest();
        if ($request === null) {
            return $this;
        } else {
            $this->setRequest($request);
        }

        $icons = [];
        $first = true;

        $path = null;

        while ($path !== "") {
            $path = rtrim($path === null ? $request->getPathInfo() : dirname($path), "/");

            $controller = $this->getController($path);
            if (!$controller) {
                continue;
            }

            list($class, $method) = explode("::", $controller);
            if (!class_exists($class)) {
                continue;
            }

            // Get icon from controller annotation
            $reflClass   = $this->annotationReader->getReflClass($class);
            $annotations = $this->annotationReader->getDefaultMethodAnnotations($reflClass)[$method] ?? [];

            $position = array_class_last(Iconize::class, $annotations);
            $iconize  = $position !== false ? $annotations[$position] : null;
            $icon     = $iconize ? $iconize->getIcons()[0] ?? null : null;

            // Get route name from controller annotation
            $position = array_class_last(Route::class, $annotations);

            $route  = $position !== false ? $annotations[$position] : null;
            $routeName          = $route ? $this->getRouteName($path) : null;
            $routeParameters    = $route ? array_filter($this->getRouteParameters($path, $route->getPath() !== null ? rtrim($route->getPath(), "/") : null) ?? []) : [];
            $routeParameterKeys = array_keys($routeParameters);

            $transPath = implode(".", array_merge([$routeName], $routeParameterKeys));
            $transParameters = array_transforms(fn ($k, $v): array => [$k,
                $k == "id" ? "#".$v : (
                    $k == "slug" ? ucwords(str_replace(["-","_"], " ", $v)) : $v
                )], $routeParameters);

            $label = $routeName ? $this->translator->trans("@controllers.".$transPath.".title", $transParameters) : null;
            $label = preg_replace("/\{\w\}/", "", $label);
            $label = str_rstrip($label, "#");
            if ($label == "@controllers.".$transPath.".title") {
                $label = "";
            }

            $pageTitle = null;
            if ($first) {
                $pageTitle = $this->getOption("page_title");
                if ($pageTitle) {
                    $this->appendItem($pageTitle);
                    $icons[] = null;
                }

                $first = false;
            }

            if ($pageTitle !== null || !$label || !$route) {
                continue;
            }

            $this->prependItem($label, $routeName, $routeParameters ?? []);
            $icons[] = $this->getOption("icons") !== false ? $icon : null;
        }

        // Remove leading paths if offset requested
        $offset = $this->getOption("offset");
        while ($offset-- > 0) {
            array_shift($this->items);
            array_shift($icons);
        }

        // Save icons
        $this->addOption("icons", array_unique_end($icons));

        $this->computed = true; // Flag as computed..
        return $this;
    }

    public function getRouteParameters(?string $url = null, ?string $urlPattern = null)
    {
        if (!$urlPattern) {
            return null;
        } // No pattern

        $urlPatternParts = explode("/", rtrim($urlPattern, "/"));

        $urlParts = explode("/", rtrim($url, "/"));
        $urlParts = array_pad($urlParts, count($urlPatternParts), "");
        if (count($urlParts) > count($urlPatternParts)) {
            return null;
        } // Url not matching pattern

        $routeParameters = [];
        foreach ($urlPatternParts as $key => $pattern) {
            if (str_starts_with($pattern, "{") && str_ends_with($pattern, "}")) {
                $pattern = substr($pattern, 1, -1);
                $routeParameters[$pattern] = $urlParts[$key] ?? null;
                continue;
            }

            if ($pattern !== ($urlParts[$key] ?? null)) {
                return null;
            } // Url not matching pattern
        }

        return $routeParameters;
    }

    public function getRouteName(?string $url = null): string
    {
        if ($url === null) {
            return "";
        }

        $baseDir = $this->getRouter()->getContext()->getBaseUrl();
        $path = parse_url($url, PHP_URL_PATH);
        if ($baseDir && strpos($path, $baseDir) === 0) {
            $path = substr($path, strlen($baseDir));
        }

        try {
            $routeMatch = $this->router->match($path);
        } catch (ResourceNotFoundException $e) {
            return '';
        }

        $route = $routeMatch['_route'] ?? "";
        return $route;
    }

    public function getController(?string $url = null): string
    {
        if ($url === null) {
            return "";
        }

        $baseDir = $this->getRouter()->getContext()->getBaseUrl();
        $path = parse_url($url, PHP_URL_PATH);
        if ($baseDir && strpos($path, $baseDir) === 0) {
            $path = substr($path, strlen($baseDir));
        }

        try {
            $routeMatch = $this->router->match($path);
        } catch (ResourceNotFoundException $e) {
            return '';
        }

        $route = $routeMatch['_controller'] ?? "";
        return $route;
    }

    public function getRouter(): RouterInterface
    {
        return $this->router;
    }
    public function setRouter(RouterInterface $router)
    {
        $this->router = $router;
        return $this;
    }

    public function getTranslator(): TranslatorInterface
    {
        return $this->translator;
    }
    public function setTranslator(TranslatorInterface $translator)
    {
        $this->translator = $translator;
        return $this;
    }

    public function getTemplate(): string
    {
        return $this->template;
    }
    public function setTemplate(string $template)
    {
        $this->template = $template;
        return $this;
    }

    public function getOptions(): array
    {
        return $this->options;
    }
    public function addOptions(array $options)
    {
        foreach ($options as $key => $option) {
            $this->addOption($key, $option);
        }
    }

    public function setOptions(array $options)
    {
        $this->options = $options;
        return $this;
    }

    public function getOption(string $name)
    {
        return $this->options[$name] ?? null;
    }
    public function addOption(string $name, $value)
    {
        $this->options[$name] = $value;
        return $this;
    }

    public function removeOption(string $name)
    {
        if (array_key_exists($name, $this->options)) {
            unset($this->options[$name]);
        }
        return $this;
    }

    protected function getFormattedItem(string $label, ?string $route = null, array $routeParameters = [])
    {
        $url = null;
        try {
            $url = $route ? $this->router->generate($route, $routeParameters) : null;
        } catch (\Exception $e) {
        }

        return [
            "label" => $label,
            "url"   => ($route ? $url : null),
            "route" => $route
        ];
    }

    public function removeItem(string $offset)
    {
        unset($this->items[$offset]);
    }
    public function prependItem(string $label, ?string $route = null, array $routeParameters = [])
    {
        array_unshift($this->items, $this->getFormattedItem($label, $route, $routeParameters));
        return $this;
    }

    public function appendItem(string $label, ?string $route = null, array $routeParameters = [])
    {
        $this->items[] = $this->getFormattedItem($label, $route, $routeParameters);
        return $this;
    }

    public function clear()
    {
        $this->items = [];
    }

    public function getLength()
    {
        return count($this->items);
    }
    public function getItems()
    {
        return $this->items;
    }

    public function getFirstItem()
    {
        return $this->getItem(0);
    }
    public function getLastItem()
    {
        return $this->getItem($this->getLength()-1);
    }
    public function getItem(int $index)
    {
        return $this->items[$index] ?? null;
    }
}
