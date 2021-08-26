<?php

namespace Base\DependencyInjection;

use Symfony\Component\Config\Definition\ConfigurationInterface;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\Builder\ArrayNodeDefinition;

class BaseConfiguration implements ConfigurationInterface
{
    private $treeBuilder;
    public function getTreeBuilder() { return $this->treeBuilder; }

    /**
     * @inheritdoc
     */
    public function getConfigTreeBuilder()
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
                ->arrayNode('user')->addDefaultsIfNotSet()
                    ->children()
                        ->booleanNode('validation')
                            ->info('Administrator check required')
                            ->defaultValue(False)
                            ->end()
                    ->end()
                    ->children()
                        ->scalarNode('property')
                            ->info('Property used to identity user (can use "property" when only tgetter is set)')
                            ->defaultValue("email")
                            ->end()
                    ->end()
                ->end()
                ->arrayNode('client')->addDefaultsIfNotSet()
                    ->children()
                        ->integerNode('timeout')
                            ->info('Time before refreshing client information')
                            ->defaultValue(0)
                            ->end()
                    ->end()
                ->end()

                ->arrayNode('maintenance')->addDefaultsIfNotSet()
                ->children()
                    ->scalarNode('redirect')
                        ->info('Maintenance redirection')
                        ->defaultValue("base_maintenance")
                        ->end()
                    ->scalarNode('homepage')
                        ->info('Website home page')
                        ->defaultValue("base_homepage")
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
                ->arrayNode('notifier')->addDefaultsIfNotSet()
                    ->children()
                        ->scalarNode('admin_recipients')
                            ->info('Administrators receiving notification')
                            ->defaultValue("ROLE_SUPERADMIN")
                            ->end()
                    ->end()
                ->end()
                ->arrayNode('twig')->addDefaultsIfNotSet()
                    ->children()
                        ->booleanNode('use_custom_loader')
                            ->info('Use base filesystem loader')
                            ->defaultValue(True)
                            ->end()
                    ->end()
                    ->children()
                        ->scalarNode('default_path')
                            ->info('Default twig path')
                            ->defaultValue("%kernel.project_dir%/vendor/xkzl/base-bundle/templates") // @Base directory
                            ->end()
                    ->end()
                    ->children()
                        ->arrayNode('form_themes')
                            ->addDefaultChildrenIfNoneSet()
                                ->prototype('scalar') // @Base directory
                                    ->defaultValue('./form/form_div_layout.html.twig')
                            ->end()
                        ->end()
                    ->end()
                    ->children()
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
                        ->booleanNode('use_custom_reader')
                            ->info('Use custom annotation reader')
                            ->defaultValue(True)
                            ->end()
                    ->end()
                    ->children()
                        ->arrayNode('paths')
                            ->addDefaultChildrenIfNoneSet()
                                ->prototype('scalar') // @Base directory
                                    ->defaultValue('%kernel.project_dir%/src/Annotation')
                            ->end()
                        ->end()
                    ->end()
                ->end()

                ->booleanNode('use_https')
                    ->info('Use base filesystem loader')
                    ->defaultValue(True)
                    ->end()
                ->scalarNode('domain')
                    ->info('Default domain')
                    ->defaultValue("localhost")
                    ->end()
                ->scalarNode('assets')
                    ->info('Domain location fo rassets')
                    ->defaultValue("assets.%domain%")
                    ->end()
                ->scalarNode('mail')
                    ->info('Default support mail')
                    ->defaultValue("support@%base.domain%")
                    ->end()
                ->scalarNode('upload_dir')
                    ->info('Domain location fo rassets')
                    ->defaultValue("%kernel.project_dir%/data/uploads")
                    ->end()
                ->integerNode('birthdate')
                    ->info('Birthdate of the website')
                    ->defaultValue(-1)
                    ->end()
                ->scalarNode('logo')
                    ->info('Path to the logo')
                    ->defaultValue("/bundles/base/logo/Symfony.png")
                    ->end()

                ->scalarNode('logging_limit')
                    ->info('Max age log')
                    ->defaultValue("+30d")
                    ->end()

                ->arrayNode('logging')
                    ->arrayPrototype()
                        ->children()
                            ->scalarNode("event")->end()
                            ->scalarNode("listener")->end()
                            ->scalarNode("statusCode")->end()
                            ->end()
                        ->end()
                    ->end()

                ->arrayNode('vendor')->addDefaultsIfNotSet()
                    ->children()
                        ->arrayNode('font_awesome')->addDefaultsIfNotSet()
                            ->children()
                                ->scalarNode('metadata')
                                    ->info('YAML metadata location: used in ')
                                    ->defaultValue("%kernel.project_dir%/public/bundles/base/vendor/font-awesome/5.15.1/metadata/icons.yml")
                                    ->end()
                            ->end()
                            ->children()
                                ->scalarNode('js')
                                    ->info('')
                                    ->defaultValue("/bundles/base/vendor/font-awesome/5.15.1/js/all.min.js") // @Base directory
                                    ->end()
                            ->end()
                            ->children()
                                ->scalarNode('css')
                                    ->info('')
                                    ->defaultValue("/bundles/base/vendor/font-awesome/5.15.1/css/all.css") // @Base directory
                                    ->end()
                            ->end()
                        ->end()
                    ->arrayNode('jscolor')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('js')
                                ->info('')
                                ->defaultValue("/bundles/base/vendor/jscolor/2.4.5/jscolor.min.js") // @Base directory
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('css')
                                ->info('')
                                ->defaultValue("/bundles/base/vendor/jscolor/2.4.5/jscolor.css") // @Base directory
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('select2')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('js')
                                ->info('')
                                ->defaultValue("/bundles/base/vendor/select2/select2-4.0.3.min.js") // @Base directory
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('css')
                                ->info('')
                                ->defaultValue("/bundles/base/vendor/select2/select2-4.0.3.min.css") // @Base directory
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('theme')
                                ->info('')
                                ->defaultValue("bootstrap4") // @Base directory
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('quill')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('js')
                                ->info('')
                                ->defaultValue("/bundles/base/vendor/quill/quill.min.js") // @Base directory
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('css')
                                ->info('')
                                ->defaultValue("/bundles/base/vendor/quill/quill.core.css") // @Base directory
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('theme')
                                ->info('')
                                ->defaultValue("snow") // @Base directory
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('highlight')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('js')
                                ->info('')
                                ->defaultValue("/bundles/base/vendor/highlight/highlight.pack.js") // @Base directory
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('css')
                                ->info('')
                                ->defaultValue("/bundles/base/vendor/highlight/styles/monokai-sublime.css") // @Base directory
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('datetimepicker')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('js')
                                ->info('')
                                ->defaultValue("/bundles/base/vendor/datetimepicker/datetimepicker-4.17.47.min.js") // @Base directory
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('css')
                                ->info('')
                                ->defaultValue("/bundles/base/vendor/datetimepicker/datetimepicker-4.17.47.min.css") // @Base directory
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('moment')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('js')
                                ->info('')
                                ->defaultValue("/bundles/base/vendor/moment/moment.min.js") // @Base directory
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('js-map')
                                ->info('')
                                ->defaultValue("/bundles/base/vendor/moment/moment.min.js.map") // @Base directory
                                ->end()
                        ->end()
                    ->end()
                ->end()
            ->end();
    }
}
