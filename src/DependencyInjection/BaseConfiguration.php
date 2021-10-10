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

                ->arrayNode('database')->addDefaultsIfNotSet()
                ->children()
                    ->arrayNode('excluded_fields')
                        ->defaultValue(['id', 'locale', 'translatable'])
                        ->beforeNormalization()
                            ->ifString()
                            ->then(function ($v) { return preg_split('/\s*,\s*/', $v); })
                    ->end()
                    ->prototype('scalar')
                        ->info('Global list of fields to exclude from form generation. (Default: id, locale, translatable)')->end()
                    ->end()
                ->end()
                ->end()

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
                        ->arrayNode('notifications')
                            ->children()
                                ->scalarNode('expiry')
                                    ->info('Time before erasing data if read')
                                    ->defaultValue("+30d")
                                    ->end()
                                ->end()
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

                    ->children()
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
                        ->scalarNode('askismet')
                            ->info('ASKISMET API Key')
                            ->defaultValue("")
                            ->end()
                    ->end()
                ->end()
                ->arrayNode('paginator')->addDefaultsIfNotSet()
                    ->children()
                        ->integerNode('page_range')
                            ->info('Range around the current page')
                            ->defaultValue(1)
                            ->end()
                    ->end()
                    ->children()
                        ->integerNode('page_size')
                            ->info('Number of element per page')
                            ->defaultValue(10)
                            ->end()
                    ->end()
                    ->children()
                        ->scalarNode('page_parameter')
                            ->info('Default parameter name in route')
                            ->defaultValue("page")
                            ->end()
                    ->end()
                    ->children()
                        ->scalarNode('default_template')
                            ->info('Default template used to display pages in sliding control')
                            ->defaultValue("@Base/paginator/sliding.html.twig")
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
                            ->defaultValue("%kernel.project_dir%/vendor/xkzl/base-bundle/templates") 
                            ->end()
                    ->end()
                    ->children()
                        ->arrayNode('form_themes')
                            ->addDefaultChildrenIfNoneSet()
                                ->prototype('scalar') 
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
                                ->prototype('scalar') 
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
                    ->defaultValue("bundles/base/logo/Symfony.png")
                    ->end()

                ->scalarNode('logging_default_expiry')
                    ->info('Max age log')
                    ->defaultValue("+30d")
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

                ->arrayNode('vendor')->addDefaultsIfNotSet()
                    ->children()
                        ->arrayNode('font_awesome')->addDefaultsIfNotSet()
                            ->children()
                                ->scalarNode('metadata')
                                    ->info('YAML metadata location: used in ')
                                    ->defaultValue("%kernel.project_dir%/publicbundles/base/vendor/font-awesome/5.15.1/metadata/icons.yml")
                                    ->end()
                            ->end()
                            ->children()
                                ->scalarNode('js')
                                    ->info('')
                                    ->defaultValue("bundles/base/vendor/font-awesome/5.15.1/js/all.min.js") 
                                    ->end()
                            ->end()
                            ->children()
                                ->scalarNode('css')
                                    ->info('')
                                    ->defaultValue("bundles/base/vendor/font-awesome/5.15.1/css/all.css") 
                                    ->end()
                            ->end()
                        ->end()
                    ->arrayNode('jscolor')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('js')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/jscolor/2.4.5/jscolor.min.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('css')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/jscolor/2.4.5/jscolor.css") 
                                ->end()
                        ->end()
                    ->end()
                    
                    ->arrayNode('sortablejs')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('js')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/sortablejs/1.14.0/Sortable.js") 
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('select2')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('js')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/select2/select2-4.0.3.min.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('css')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/select2/select2-4.0.3.min.css") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('theme')
                                ->info('')
                                ->defaultValue("bootstrap4") 
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('quill')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('js')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/quill/quill.min.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('css')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/quill/quill.core.css") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('theme')
                                ->info('')
                                ->defaultValue("snow") 
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('highlight')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('js')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/highlight/highlight.pack.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('css')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/highlight/styles/monokai-sublime.css") 
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('dropzone')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('js')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/dropzone/5.9.2/min/dropzone.min.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('css')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/dropzone/5.9.2/min/dropzone.min.css") 
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('cropperjs')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('js')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/cropperjs/1.5.12/dist/cropper.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('css')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/cropperjs/1.5.12/dist/cropper.css") 
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('datetimepicker')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('js')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/datetimepicker/datetimepicker-4.17.47.min.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('css')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/datetimepicker/datetimepicker-4.17.47.min.css") 
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('moment')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('js')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/moment/moment.min.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('js-map')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/moment/moment.min.js.map") 
                                ->end()
                        ->end()
                    ->end()
                ->end()
            ->end();
    }
}
