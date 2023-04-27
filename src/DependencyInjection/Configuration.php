<?php

namespace Base\DependencyInjection;

use Base\Imagine\Filter\Basic\Definition\UltraHighDefinitionFilter;

use Symfony\Component\Config\Definition\ConfigurationInterface;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\Builder\ArrayNodeDefinition;
use Base\Service\Model\IconProvider\Adapter\FontAwesomeAdapter;
use Symfony\Component\Uid\Uuid;

class Configuration implements ConfigurationInterface
{
    private $treeBuilder;
    public function getTreeBuilder(): TreeBuilder
    {
        return $this->treeBuilder;
    }

    /**
     * @inheritdoc
     */
    public function getConfigTreeBuilder(): TreeBuilder
    {
        $this->treeBuilder = new TreeBuilder('base');
        $rootNode = $this->treeBuilder->getRootNode();

        $this->addGlobalOptionsSection($rootNode);

        return $this->treeBuilder;
    }

    private function addGlobalOptionsSection(ArrayNodeDefinition $rootNode)
    {
        $rootNode
            ->children()

                ->arrayNode('database')->addDefaultsIfNotSet()
                ->children()

                    ->booleanNode('fallback_warning')
                        ->info('Fallback warning disable in case there is no fallback')
                        ->defaultValue(true)
                    ->end()

                    ->booleanNode('use_custom')
                        ->info('Use custom database settings')
                        ->defaultValue(null)
                    ->end()

                    ->arrayNode('excluded_fields')
                        ->defaultValue(['id', 'locale', 'translatable'])
                        // ->beforeNormalization()
                        //     ->then(function ($v) { return preg_split('/\s*,\s*/', $v); })
                        //     ->end()
                    ->prototype('scalar')
                        ->info('Global list of fields to exclude from form generation. (Default: id, locale, translatable)')->end()
                        ->end()
                    ->end()
                ->end()

                ->arrayNode('share')
                ->arrayPrototype()
                    ->children()
                        ->scalarNode("id")->end()
                        ->scalarNode("url")->end()
                        ->end()
                    ->end()
                ->end()

                ->arrayNode('user')->addDefaultsIfNotSet()
                    ->children()
                    ->scalarNode('token_default_throttling')
                        ->info('Default throttling time between two tokens received')
                        ->defaultValue(3*60)
                        ->end()
                    ->end()

                    ->children()
                        ->scalarNode('identifier')
                            ->info('Property used to identity user')
                            ->defaultValue("email")
                            ->end()
                        ->integerNode('active_delay')
                            ->info('Threshold considering user as inactive ("active delay" is expected to be lower than "online delay")')
                            ->defaultValue(60)
                            ->end()
                        ->integerNode('online_delay')
                            ->info('Threshold considering user as offline')
                            ->defaultValue(60*5)
                            ->end()
                        ->arrayNode('notifications')
                            ->children()
                                ->scalarNode('expiry')
                                    ->info('Time before erasing data if read')
                                    ->defaultValue("+30d")
                                    ->end()
                                ->end()
                            ->end()
                        ->arrayNode('register')
                            ->children()
                                ->booleanNode('autoapprove')
                                    ->info('Administrator check required')
                                    ->defaultValue(false)
                                    ->end()
                                ->booleanNode('notify_admins')
                                    ->info('Administrator are notify when someone register')
                                    ->defaultValue(false)
                                    ->end()
                                ->end()
                            ->end()
                    ->end()
                ->end()

                ->arrayNode('access_restriction')->addDefaultsIfNotSet()
                    ->children()
                        ->scalarNode('redirect_on_deny')
                            ->info('Redirection in case of access restriction')
                            ->defaultValue(null)
                        ->end()

                        ->booleanNode('public_access')
                            ->info('Access to public visitors')
                            ->defaultValue(true)
                        ->end()

                        ->booleanNode('user_access')
                            ->info('Access to users')
                            ->defaultValue(true)
                        ->end()

                        ->booleanNode('admin_access')
                            ->info('Access to administrators')
                            ->defaultValue(true)
                        ->end()

                        ->arrayNode('firewalls')
                            ->addDefaultChildrenIfNoneSet()
                                ->prototype('scalar')
                                ->defaultValue('main')
                            ->end()
                        ->end()

                        ->arrayNode('route_exceptions')
                            ->addDefaultChildrenIfNoneSet()
                                ->prototype('scalar')
                                ->defaultValue('@localhost$')
                            ->end()
                        ->end()

                        ->arrayNode('exceptions')
                            ->arrayPrototype()->addDefaultsIfNotSet()
                                ->children()
                                    ->scalarNode('locale')
                                        ->defaultValue(null)
                                    ->end()
                                    ->scalarNode('env')
                                        ->defaultValue(null)
                                    ->end()
                                    ->scalarNode('host')
                                        ->info('Regex ')
                                        ->defaultValue(null)
                                    ->end()
                                    ->scalarNode('path')
                                        ->info('Regex ')
                                        ->defaultValue(null)
                                    ->end()
                                    ->scalarNode('domain')
                                        ->info('Regex ')
                                        ->defaultValue(null)
                                    ->end()
                                    ->scalarNode('subdomain')
                                        ->info('Regex ')
                                        ->defaultValue(null)
                                    ->end()
                                    ->scalarNode('scheme')
                                        ->info('Regex ')
                                        ->defaultValue(null)
                                    ->end()
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()

                ->arrayNode('site')->addDefaultsIfNotSet()
                    ->children()
                        ->scalarNode('index')
                            ->info('Website home page')
                            ->defaultValue("app_index")
                            ->end()
                        ->arrayNode('maintenance')->addDefaultsIfNotSet()
                            ->children()
                                ->scalarNode('redirect_on_deny')
                                    ->info('Maintenance redirection')
                                    ->defaultValue("maintenance")
                                    ->end()
                                ->arrayNode('exception')
                                    ->prototype('scalar')->end()
                                        ->useAttributeAsKey('code')
                                        ->prototype('scalar')->end()
                                        ->defaultValue([])
                                    ->end()
                                ->scalarNode('lockpath')
                                    ->info('Maintenance lock file location')
                                    ->defaultValue("%kernel.project_dir%/public/maintenance.lock")
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()

                ->arrayNode('router')->addDefaultsIfNotSet()
                    ->children()
                        ->booleanNode('use_custom')
                            ->info('Use custom router')
                            ->defaultValue(null)
                            ->end()

                        ->booleanNode('ip_access')
                            ->info('Allow accessing by')
                            ->defaultValue(false)
                        ->end()

                        ->booleanNode('use_fallbacks')
                            ->info('Restrict to permitted hosts')
                            ->defaultValue(false)
                        ->end()

                        ->booleanNode('fallback_warning')
                            ->info('Fallback warning disable in case there is no fallback')
                            ->defaultValue(true)
                        ->end()

                        ->arrayNode('host_fallbacks')
                            ->arrayPrototype()->addDefaultsIfNotSet()
                                ->children()
                                    ->scalarNode('locale')
                                        ->defaultValue(null)
                                    ->end()
                                    ->scalarNode('env')
                                        ->defaultValue('%env(APP_ENV)%')
                                    ->end()
                                    ->booleanNode('reduction')
                                        ->defaultValue(false)
                                    ->end()
                                    ->variableNode('subdomain')
                                        ->info('Sub-domain')
                                        ->defaultValue([])
                                    ->end()
                                    ->variableNode('machine')
                                        ->info('Machine name')
                                        ->defaultValue([])
                                    ->end()
                                    ->variableNode('domain')
                                        ->info('Domain')
                                        ->defaultValue([])
                                    ->end()
                                    ->variableNode('port')
                                        ->info('Port number')
                                        ->defaultValue([80])
                                    ->end()
                                    ->scalarNode('base_dir')
                                        ->info('Base directory')
                                        ->defaultValue("/")
                                    ->end()
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()

                ->arrayNode('parameter_bag')->addDefaultsIfNotSet()

                    ->children()
                        ->booleanNode('use_setting_bag')
                            ->info('Use setting bag from database')
                            ->defaultValue(null)
                        ->end()
                        ->booleanNode('use_hot_bag')
                            ->info('Use hot bag parameter rewriting')
                            ->defaultValue(null)
                        ->end()
                    ->end()
                ->end()

                ->arrayNode('notifier')->addDefaultsIfNotSet()

                    ->children()

                        ->booleanNode('mailer')
                            ->info('Enable mailer')
                            ->defaultValue(true)
                        ->end()

                        ->booleanNode('technical_loopback')
                            ->info('Do not allow sending email until loopback is removed')
                            ->defaultValue(true)
                        ->end()

                        ->arrayNode('technical_recipient')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('email')
                                ->info('Technical contact email')
                                ->defaultValue(null)
                                ->end()
                            ->scalarNode('phone')
                                ->info('Default phone number')
                                ->defaultValue(null)
                                ->end()
                            ->end()
                        ->end()
                        ->scalarNode('admin_role')
                            ->info('Administrators receiving notifications')
                            ->defaultValue("ROLE_EDITOR")
                        ->end()
                        ->arrayNode('test_recipients')
                            ->addDefaultChildrenIfNoneSet()
                                ->prototype('scalar')
                                ->defaultValue('@localhost$')
                            ->end()
                        ->end()
                        ->arrayNode('options')
                            ->arrayPrototype()
                                ->children()
                                    ->scalarNode("channel")->end()
                                    ->scalarNode("markAsRead")->end()
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()
                ->arrayNode('spam')->addDefaultsIfNotSet()
                    ->children()
                        ->scalarNode('akismet')
                            ->info('AKISMET API Key')
                            ->defaultValue("")
                            ->end()
                    ->end()
                ->end()
                ->arrayNode('time_machine')->addDefaultsIfNotSet()
                    ->children()
                        ->scalarNode('snapshot_limit')
                            ->info('Maximum number of snapshot in a configuration')
                            ->defaultValue(9)
                            ->end()
                        ->scalarNode('compression')
                            ->info('Default compression algorithm')
                            ->defaultValue("gzip")
                            ->end()
                    ->end()
                ->end()
                ->arrayNode('icon_provider')->addDefaultsIfNotSet()
                    ->children()
                        ->scalarNode('default_adapter')
                            ->info('Default icon provider class')
                            ->defaultValue(FontAwesomeAdapter::class)
                            ->end()
                    ->end()
                ->end()

                ->arrayNode('uploader')->addDefaultsIfNotSet()
                    ->children()
                    ->booleanNode('warmup')
                        ->info('Automatic image uploader warmup')
                        ->defaultValue(true)
                        ->end()
                    ->arrayNode('formats')
                        ->arrayPrototype()
                            ->info("Specific formats")
                            ->children()
                                ->scalarNode("class")->end()
                                ->scalarNode("property")->end()
                                ->scalarNode("width")->end()
                                ->scalarNode("height")->end()
                                ->end()
                            ->end()
                        ->end()
                        ->end()
                    ->end()

                ->arrayNode('images')->addDefaultsIfNotSet()
                    ->children()
                        ->scalarNode('max_resolution')
                            ->defaultValue(UltraHighDefinitionFilter::class)
                            ->end()
                        ->booleanNode('autorotate')
                            ->defaultValue(true)
                            ->end()
                        ->booleanNode('debug')
                            ->defaultValue(false)
                            ->end()
                        ->booleanNode('disable_profiler')
                            ->defaultValue(true)
                            ->end()
                        ->scalarNode('max_quality')
                            ->defaultValue(1)
                            ->end()
                        ->scalarNode('timeout')
                            ->defaultValue(60)
                            ->end()
                        ->scalarNode('enable_webp')
                            ->defaultValue(true)
                            ->end()
                        ->arrayNode('no_image')
                            ->arrayPrototype()
                            ->info("Replacement image")
                            ->children()
                                ->scalarNode("extension")->end()
                                ->scalarNode("path")->end()
                                ->end()
                            ->end()
                        ->end()
                        ->booleanNode('fallback')
                            ->defaultValue(false)
                            ->end()
                        ->scalarNode('warmup')
                            ->defaultValue(true)
                            ->end()
                    ->arrayNode('formats')
                        ->arrayPrototype()
                            ->info("Specific formats")
                            ->children()
                                ->scalarNode("class")->end()
                                ->scalarNode("property")->end()
                                ->scalarNode("width")->end()
                                ->scalarNode("height")->end()
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()
                ->arrayNode('paginator')->addDefaultsIfNotSet()
                    ->children()
                        ->integerNode('page_range')
                            ->info('Range around the current page')
                            ->defaultValue(1)
                            ->end()
                        ->integerNode('page_size')
                            ->info('Number of element per page')
                            ->defaultValue(10)
                            ->end()
                        ->scalarNode('page_parameter')
                            ->info('Default parameter name in route')
                            ->defaultValue("page")
                            ->end()
                        ->scalarNode('default_template')
                            ->info('Default template used to display pages in sliding control')
                            ->defaultValue("@Base/paginator/sliding.html.twig")
                            ->end()
                    ->end()
                ->end()
                ->arrayNode('obfuscator')->addDefaultsIfNotSet()
                    ->children()
                        ->integerNode('level')
                            ->info('Compression level')
                            ->defaultValue(-1)
                            ->end()
                        ->scalarNode('uuid')
                            ->info('Use uuid shortening')
                            ->defaultValue(Uuid::NAMESPACE_URL)
                            ->end()
                        ->integerNode('encoding')
                            ->info('Compression encoding')
                            ->defaultValue(null)
                            ->end()
                        ->integerNode('max_length')
                            ->info('Decoding max length')
                            ->defaultValue(0)
                            ->end()
                        ->scalarNode('compression')
                            ->info('Compression algorithm')
                            ->defaultValue("null")
                            ->end()
                    ->end()
                ->end()
                ->arrayNode('twig')->addDefaultsIfNotSet()
                    ->children()
                        ->arrayNode('breakpoints')
                            ->arrayPrototype()
                                ->children()
                                    ->scalarNode("name")->end()
                                    ->scalarNode("media")->end()
                                ->end()
                            ->end()
                        ->end()

                        ->arrayNode('script_attributes')->addDefaultsIfNotSet()
                            ->children()
                                ->scalarNode('defer')
                                    ->defaultValue(false)
                                    ->end()
                                ->scalarNode('async')
                                    ->defaultValue(false)
                                    ->end()
                            ->end()
                        ->end()
                        ->arrayNode('link_attributes')->addDefaultsIfNotSet()
                            ->children()
                                ->scalarNode('defer')
                                    ->defaultValue(false)
                                    ->end()
                                ->scalarNode('async')
                                    ->defaultValue(false)
                                    ->end()
                            ->end()
                        ->end()

                        ->booleanNode('use_custom')
                            ->info('Use base filesystem loader')
                            ->defaultValue(null)
                            ->end()
                        ->booleanNode('use_form2')
                            ->info('Use custom base form style')
                            ->defaultValue(true)
                            ->end()
                        ->booleanNode('use_ea')
                            ->info('Include EA form style')
                            ->defaultValue(true)
                            ->end()
                        ->booleanNode('use_bootstrap')
                            ->info('Use bootstrap style in forms')
                            ->defaultValue(true)
                            ->end()
                        ->booleanNode('autoappend')
                            ->info('Autoappend required dependencies in html content')
                            ->defaultValue(true)
                            ->end()
                        ->scalarNode('default_path')
                            ->info('Default twig path')
                            ->defaultValue("%kernel.project_dir%/vendor/glitchr/base-bundle/templates")
                            ->end()
                        ->arrayNode('form_themes')
                            ->addDefaultChildrenIfNoneSet()
                                ->prototype('scalar')
                                ->defaultValue('./form/form_div_layout.html.twig')
                                ->end()
                        ->end()

                        ->arrayNode('editor')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('operator')
                                ->defaultValue(UltraHighDefinitionFilter::class)
                                ->end()
                            ->end()
                        ->end()

                        ->arrayNode('paths')
                            ->arrayPrototype()
                                ->children()
                                    ->scalarNode("path")->end()
                                    ->scalarNode("namespace")->end()
                                    ->end()
                                ->end()
                            ->end()
                        ->end()
                ->end()

                ->arrayNode('annotations')->addDefaultsIfNotSet()
                    ->children()
                        ->booleanNode('use_custom')
                            ->info('Use custom annotation reader')
                            ->defaultValue(null)
                            ->end()
                        ->arrayNode('paths')
                            ->addDefaultChildrenIfNoneSet()
                                ->prototype('scalar')
                                    ->defaultValue('%kernel.project_dir%/src/Annotation')
                            ->end()
                        ->end()
                    ->end()
                ->end()

                ->arrayNode('extension')->addDefaultsIfNotSet()
                    ->children()
                    ->scalarNode('max_revisions')
                        ->info('Max number of revision for a given entity')
                        ->defaultValue(5)
                        ->end()
                    ->scalarNode('empty_trash')
                        ->info('Time before hard deletion')
                        ->defaultValue(5)
                        ->end()
                    ->scalarNode('logging_default_expiry')
                        ->info('Default logging expirty')
                        ->defaultValue(3*60)
                        ->end()
                    ->arrayNode('logging')
                        ->arrayPrototype()
                            ->children()
                                ->scalarNode("event")->end()
                                ->scalarNode("pretty")->end()
                                ->scalarNode("statusCode")->end()
                                ->scalarNode("expiry")->end()
                                ->end()
                            ->end()
                            ->end()
                        ->end()
                    ->end()
            ->end();
    }
}
