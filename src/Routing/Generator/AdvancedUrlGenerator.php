<?php

namespace Base\Routing\Generator;

use Base\Security\LoginFormAuthenticator;
use Base\Security\RescueFormAuthenticator;
use Base\Service\LocaleProvider;
use Base\Traits\BaseTrait;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Symfony\Component\Routing\Generator\CompiledUrlGenerator;
use Symfony\Component\Routing\RequestContext;

class AdvancedUrlGenerator extends CompiledUrlGenerator
{
    use BaseTrait;

    protected $cachedRoutes;
    protected $compiledRoutes;

    public function getCompiledRoutes():array { return $this->compiledRoutes; }

    public function __construct(array $compiledRoutes, RequestContext $context, LoggerInterface $logger = null, string $defaultLocale = null)
    {
        // NB: This generator needs separate context as it internally calls its corresponding Matcher in generates..
        //     (.. and Matcher class is changing context.)
        $context = new RequestContext($context->getBaseUrl(), $context->getMethod(), $context->getHost(), $context->getScheme(), $context->getHttpPort(), $context->getHttpsPort(), $context->getPathInfo(), $context->getQueryString());
        parent::__construct($compiledRoutes, $context, $logger, $defaultLocale);

        $this->compiledRoutes = $compiledRoutes;
        $this->cachedRoutes   = $this->getRouter()->getCacheRoutes() !== null
            ? $this->getRouter()->getCacheRoutes()->get() ?? []
            : [];
    }

    protected function resolveUrl(string $routeName, array $routeParameters = [], int $referenceType = self::ABSOLUTE_PATH): ?string
    {
        // Transforms requested route by adding parameters
        if($routeName === null) return null;
        if(($route = $this->getRouter()->getRoute($routeName))) {

            if($route->getHost()) $referenceType = self::ABSOLUTE_URL;
            if(str_contains($route->getHost().$route->getPath(), "{") && str_contains($route->getHost().$route->getPath(), "}")) {

                if(preg_match_all("/{(\w*)}/", $route->getHost().$route->getPath(), $matches)) {

                    $parse = parse_url2(get_url());
                    $parameterNames = array_flip($matches[1]);
                    $routeParameters = array_merge(
                        array_intersect_key($parse, $parameterNames),
                        $route->getDefaults(),
                        $routeParameters,
                    );

                    $search  = array_map(fn($k) => "{".$k."}", array_keys($parse));
                    $replace = array_values($parse);
                    foreach($routeParameters as $key => &$routeParameter) {

                        $routeParameter = $routeParameter ? str_replace($search, $replace, $routeParameter) : $routeParameter;
                        if($key == "host") $routeParameter = str_lstrip($routeParameter, "www.");
                    }
                }
            }
        }

        if (!empty($routeName)) {

            try { return parent::generate($routeName, $routeParameters, $referenceType); }
            catch (RouteNotFoundException $e) { }

            try { return parent::generate($routeName.".".LocaleProvider::getDefaultLang(), $routeParameters, $referenceType); }
            catch (RouteNotFoundException $e) { throw $e; }

        }

        $request = $this->getRouter()->getRequest();
        if(!$request) return null;

        $routeName = $request->get('_route');
        return $routeName ? parent::generate($routeName, [], $referenceType) : null;
    }

    public function resolveParameters(?array $routeParameters = null, int $referenceType = self::ABSOLUTE_PATH): ?array
    {
        if($routeParameters !== null) {

            // Use either parameters or $_SERVER variables to determine the host to provide
            $scheme    = array_pop_key("_scheme"  , $routeParameters) ?? $this->getSettingBag()->scheme();
            $host      = array_pop_key("_host"    , $routeParameters) ?? $this->getSettingBag()->host();
            $baseDir   = array_pop_key("_base_dir", $routeParameters) ?? $this->getSettingBag()->base_dir();
            $parse     = parse_url2(get_url($scheme, $host, $baseDir));

            if($parse && array_key_exists("host", $parse))
                $this->getContext()->setHost($parse["host"]);
            if($parse && array_key_exists("base_dir", $parse))
                $this->getContext()->setBaseUrl($parse["base_dir"]);

        } else {

            $parse = parse_url2(get_url()); // Make sure also it gets the basic context
            if($parse && array_key_exists("host", $parse))
                $this->getContext()->setHost($parse["host"]);
            if($parse && array_key_exists("base_dir", $parse))
                $this->getContext()->setBaseUrl($parse["base_dir"]);
        }

        return $routeParameters;
    }

    public function generate(string $routeName, array $routeParameters = [], int $referenceType = self::ABSOLUTE_PATH): string
    {
        //
        // Prevent to generate custom route with Symfony internal route.
        // NB: It breaks and gets infinite loop due to "_profiler*" route, if not set..
        if(str_starts_with($routeName, "_")) {

            $routeParameters = $this->resolveParameters() ?? $routeParameters;
            try { return parent::generate($routeName, $routeParameters, $referenceType); }
            catch (Exception $e ) { throw $e; }
        }

        //
        // Update context
        $routeParameters = $this->resolveParameters($routeParameters, $referenceType);

        // Check whether the route is already cached
        $hash = $this->getRouter()->getRouteHash($routeName, $routeParameters, $referenceType);
        if(array_key_exists($hash, $this->cachedRoutes)) {

            $cachedRoute = $this->cachedRoutes[$hash];
            return $this->resolveUrl($cachedRoute["_name"], $routeParameters, $referenceType);
        }

        $routeGroups  = $this->getRouter()->getRouteGroups($routeName);
        $routeDefaultName = first($routeGroups);
        $routes = array_filter(array_transforms(fn($k, $routeName): array => [$routeName, $this->getRouter()->getRoute($routeName)], $routeGroups));

        //
        // Try to compute subgroup (or base one)
        $routeUrl = null;
        $routeRequirements = $routes[$routeName]->getRequirements();

        try { $routeUrl = $this->resolveUrl($routeName, $routeParameters, $referenceType); }
        catch(Exception $e) {

            if ($routeName == $routeDefaultName) throw $e;

            $routeName = $routeDefaultName;
            $routeRequirements = $routes[$routeName]->getRequirements();
            $routeUrl = $this->resolveUrl($routeName, $routeParameters, $referenceType);
        }

        $cache = $this->getRouter()->getCache();
        $cacheRoutes = $this->getRouter()->getCacheRoutes();
        if($cacheRoutes !== null) {

            $this->cachedRoutes[$hash] = [
                "_name" => $routeName,
                "_requirements" => $routeRequirements
            ];

            $cache->save($cacheRoutes->set($this->cachedRoutes));
        }

        return $routeUrl;
    }

    public function format(string $url): string {

        $parse = parse_url2($url);

        $allowedSubdomain = false;
        $permittedSubdomains = $this->getParameterBag()->get("base.host_restriction.permitted_subdomains") ?? [];
        if(!$this->getRouter()->keepMachine() && !$this->getRouter()->keepSubdomain())
            $permittedSubdomains = "^$"; // Special case if both subdomain and machine are unallowed

        foreach($permittedSubdomains as $permittedSubdomain)
            $allowedSubdomain |= preg_match("/".$permittedSubdomain."/", $parse["subdomain"] ?? null);

        // Special case for login form.. to be redirected to rescue authenticator if no access right
        $routeName = $this->getRouter()->getRouteName();
        if(!LoginFormAuthenticator::isSecurityRoute($routeName) && !RescueFormAuthenticator::isSecurityRoute($routeName))
        {
            // Special case for WWW subdomain
            if(!array_key_exists("subdomain", $parse) && !array_key_exists("machine", $parse) && !$allowedSubdomain) {
                $parse["subdomain"] = "www";
            } else if( array_key_exists("subdomain", $parse) && !$allowedSubdomain) {

                if($parse["subdomain"] === "www") $parse = array_key_removes($parse, "subdomain");
                else $parse["subdomain"] = "www";
            }

            if(array_key_exists("machine",   $parse) && !$this->getRouter()->keepMachine()  )
                $parse = array_key_removes($parse, "machine");

            if(array_key_exists("subdomain", $parse) && !$this->getRouter()->keepSubdomain())
                if(array_key_exists("machine",   $parse) || !$this->getRouter()->keepMachine())
                    $parse = array_key_removes($parse, "subdomain");
        }

        return compose_url(
            $parse["scheme"] ?? null, $parse["user"] ?? null, $parse["password"] ?? null,
            $parse["machine"] ?? null, $parse["subdomain"] ?? null, $parse["domain"] ?? null, $parse["port"] ?? null,
            $parse["path"] ?? null,
        );
    }
}
