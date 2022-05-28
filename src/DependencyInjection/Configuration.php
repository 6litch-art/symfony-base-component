<?php

namespace Base\DependencyInjection;

use Base\Filter\Advanced\Thumbnail\UltraHighDefinitionFilter;

use Symfony\Component\Config\Definition\ConfigurationInterface;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\Builder\ArrayNodeDefinition;
use Base\Model\IconProvider\Adapter\FontAwesomeAdapter;
class Configuration implements ConfigurationInterface
{
    private $treeBuilder;
    public function getTreeBuilder() : TreeBuilder { return $this->treeBuilder; }

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
                        ->booleanNode('autoapprove')
                            ->info('Administrator check required')
                            ->defaultValue(False)
                            ->end()
                    ->end()
                    
                    ->children()
                        ->scalarNode('identifier')
                            ->info('Property used to identity user')
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
                            ->defaultValue("maintenance")
                            ->end()
                        ->scalarNode('homepage')
                            ->info('Website home page')
                            ->defaultValue("app_index")
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
                        ->scalarNode('technical_support')
                            ->info('Hardcoded technical support')
                        ->end()
                    ->end()

                    ->children()
                        ->scalarNode('admin_role')
                            ->info('Administrators receiving notifications')
                            ->defaultValue("ROLE_EDITOR")
                        ->end()
                    ->end()


                    ->children()
                        ->arrayNode('test_recipients')
                            ->addDefaultChildrenIfNoneSet()
                                ->prototype('scalar') 
                                ->defaultValue('@localhost$')
                            ->end()
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
                        ->scalarNode('akismet')
                            ->info('AKISMET API Key')
                            ->defaultValue("")
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
                ->arrayNode('image')->addDefaultsIfNotSet()
                    ->children()
                        ->scalarNode('max_resolution')
                            ->defaultValue(UltraHighDefinitionFilter::class)
                            ->end()
                        ->scalarNode('max_quality')
                            ->defaultValue(1)
                            ->end()
                        ->scalarNode('enable_webp')
                            ->defaultValue(true)
                            ->end()
                        ->scalarNode('no_image')
                            ->defaultValue("bundles/base/no-image.png")
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
                ->arrayNode('breadcrumb')->addDefaultsIfNotSet()
                    ->children()
                        ->integerNode('separator')
                            ->info('Breadcrumb separator (if used by template)')
                            ->defaultValue(" / ")
                            ->end()
                    ->end()
                    ->children()
                        ->integerNode('class_item')
                            ->info('Breadcrumb item class attribute')
                            ->defaultValue("breadcrumb-item")
                            ->end()
                    ->end()
                    ->children()
                        ->scalarNode('class')
                            ->info('Breadcrumb class attribute')
                            ->defaultValue("breadcrumb")
                            ->end()
                    ->end()
                    ->children()
                        ->scalarNode('default_template')
                            ->info('Default template used to display breadcrumb')
                            ->defaultValue("@Base/breadcrumb/default.html.twig")
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
                        ->booleanNode('use_form2')
                            ->info('Use custom base form style')
                            ->defaultValue(True)
                            ->end()
                    ->end()
                    ->children()
                        ->booleanNode('use_ea')
                            ->info('Include EA form style')
                            ->defaultValue(True)
                            ->end()
                    ->end()
                    ->children()
                        ->booleanNode('use_bootstrap')
                            ->info('Use bootstrap style in forms')
                            ->defaultValue(True)
                            ->end()
                    ->end()
                    ->children()
                        ->booleanNode('autoappend')
                            ->info('Autoappend required dependencies in html content')
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

                ->arrayNode('extension')->addDefaultsIfNotSet()
                    ->children()
                    ->scalarNode('max_revisions')
                        ->info('Max number of revision for a given entity')
                        ->defaultValue(5)
                        ->end()
                    ->end()

                    ->children()
                    ->scalarNode('empty_trash')
                        ->info('Time before hard deletion')
                        ->defaultValue(5)
                        ->end()
                    ->end()
                    
                    ->children()
                    ->scalarNode('logging_default_expiry')
                        ->info('Default logging expirty')
                        ->defaultValue(3*60)
                        ->end()
                    ->end()
                    
                    ->children()
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
                ->arrayNode('vendor')->addDefaultsIfNotSet()
                    ->children()
                        ->arrayNode('font_awesome')->addDefaultsIfNotSet()
                            ->children()
                                ->scalarNode('metadata')
                                    ->info('YAML metadata location')
                                    ->defaultValue("%kernel.project_dir%/public/bundles/base/vendor/font-awesome/5.15.4/metadata/icons.json")
                                    ->end()
                            ->end()
                            ->children()
                                ->scalarNode('javascript')
                                    ->info('')
                                    ->defaultValue("bundles/base/vendor/font-awesome/5.15.4/js/all.min.js") 
                                    ->end()
                            ->end()
                            ->children()
                                ->scalarNode('stylesheet')
                                    ->info('')
                                    ->defaultValue("bundles/base/vendor/font-awesome/5.15.4/css/all.css") 
                                    ->end()
                            ->end()
                        ->end()
                        ->arrayNode('bootstrap_twitter')->addDefaultsIfNotSet()
                            ->children()
                                ->scalarNode('metadata')
                                    ->info('JSON metadata location')
                                    ->defaultValue("%kernel.project_dir%/public/bundles/base/vendor/bootstrap-icons/1.8.1/bootstrap-icons.json")
                                    ->end()
                            ->end()
                            ->children()
                                ->scalarNode('stylesheet')
                                    ->info('')
                                    ->defaultValue("bundles/base/vendor/bootstrap-icons/1.8.1/bootstrap-icons.css") 
                                    ->end()
                            ->end()
                        ->end()
                    ->arrayNode('pickr')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('javascript')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/pickr/1.8.2/dist/pickr.min.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('stylesheet')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/pickr/1.8.2/dist/themes/classic.min.css") 
                                ->end()
                        ->end()
                    ->end()
                    ->arrayNode('clipboardjs')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('javascript')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/clipboardjs/clipboard.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('stylesheet')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/clipboardjs/clipboard.css") 
                                ->end()
                        ->end()
                    ->end()
                    
                    ->arrayNode('jscolor')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('javascript')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/jscolor/2.4.5/jscolor.min.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('stylesheet')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/jscolor/2.4.5/jscolor.css") 
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('sortablejs')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('javascript')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/sortablejs/1.14.0/Sortable.js") 
                                ->end()
                        ->end()
                    ->end()


                    ->arrayNode('jquery')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('javascript')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/jquery/jquery-3.5.1.min.js") 
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('jquery-ui')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('javascript')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/jquery/jquery.ui-1.12.1.min.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('stylesheet')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/jquery/jquery.ui-1.12.1.min.css") 
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('select2')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('javascript')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/select2/select2-4.0.13.full.min.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('stylesheet')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/select2/select2-4.0.13.min.css") 
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
                            ->scalarNode('javascript')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/quill/quill.min.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('stylesheet')
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
                            ->scalarNode('javascript')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/highlight/highlight.pack.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('stylesheet')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/highlight/styles/monokai-sublime.css") 
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('dropzone')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('javascript')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/dropzone/5.9.2/dropzone.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('stylesheet')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/dropzone/5.9.2/dropzone.css") 
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('cropperjs')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('javascript')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/cropperjs/1.5.12/dist/cropper.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('stylesheet')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/cropperjs/1.5.12/dist/cropper.css") 
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('cookie-consent')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('javascript')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/cookie-consent/cookie-consent.js") 
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('lightbox2b')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('javascript')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/lightbox2b/lightbox2b.js") 
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('lightbox')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('javascript')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/lightbox2b/2.11.3/dist/js/lightbox.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('stylesheet')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/lightbox2b/2.11.3/dist/css/lightbox.css") 
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('datetimepicker')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('javascript')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/datetimepicker/datetimepicker-4.17.47.min.js") 
                                ->end()
                        ->end()
                        ->children()
                            ->scalarNode('stylesheet')
                                ->info('')
                                ->defaultValue("bundles/base/vendor/datetimepicker/datetimepicker-4.17.47.min.css") 
                                ->end()
                        ->end()
                    ->end()

                    ->arrayNode('moment')->addDefaultsIfNotSet()
                        ->children()
                            ->scalarNode('javascript')
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
