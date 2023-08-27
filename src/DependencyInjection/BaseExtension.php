<?php

namespace Base\DependencyInjection;

use Base\Annotations\AnnotationInterface;
use Base\Cache\Abstract\AbstractLocalCacheInterface;
use Base\Database\Entity\EntityExtensionInterface;
use Base\EntityDispatcher\EventDispatcherInterface;
use Base\Service\Model\Currency\CurrencyApiInterface;
use Base\Service\Model\IconProvider\AbstractIconAdapter;
use Base\Service\Model\IconProvider\IconAdapterInterface;
use Base\Service\Model\Obfuscator\CompressionInterface;
use Base\Twig\TagRendererInterface;
use Symfony\Component\Config\Definition\Processor;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\XmlFileLoader;
use Symfony\Component\Workflow\WorkflowInterface;
use Base\Controller\Backend\AbstractCrudController;

use Base\Bundle\AbstractBaseExtension;

/**
 *
 */
class BaseExtension extends AbstractBaseExtension
{
    /**
     * {@inheritdoc}
     */
    public function load(array $configs, ContainerBuilder $container): void
    {
        //
        // Load service declaration (includes services, controllers,..)

        // Format XML
        $loader = new XmlFileLoader($container, new FileLocator(\dirname(__DIR__, 2) . '/config'));
        $loader->load('services.xml');
        $loader->load('services-public.xml');
        $loader->load('services-fix.xml');
        $loader->load('services-decoration.xml');

        // Configuration file: ./config/package/base.yaml
        $processor = new Processor();
        $configuration = new BaseConfiguration();
        $config = $processor->processConfiguration($configuration, $configs);

        $this->setConfiguration($container, $config, $configuration->getTreeBuilder()->getRootNode()->getNode()->getName());

        // Override and merge form_themes.. to add some features..
        $container->setParameter('twig.form.resources', array_merge(
            $config['twig']['form_themes'],
            $container->getParameter('twig.form.resources')
        ));

        $container->registerForAutoconfiguration(AbstractIconAdapter::class)->addTag('base.service.icon');
        $container->registerForAutoconfiguration(EntityExtensionInterface::class)->addTag('base.entity_extension');
        $container->registerForAutoconfiguration(AnnotationInterface::class)->addTag('base.annotation');
        $container->registerForAutoconfiguration(IconAdapterInterface::class)->addTag('base.icon_provider');
        $container->registerForAutoconfiguration(SharerAdapterInterface::class)->addTag('base.service.sharer');
        $container->registerForAutoconfiguration(AbstractLocalCacheInterface::class)->addTag('base.simple_cache');
        $container->registerForAutoconfiguration(CurrencyApiInterface::class)->addTag('currency.api');
        $container->registerForAutoconfiguration(CompressionInterface::class)->addTag('obfuscator.compressor');
        $container->registerForAutoconfiguration(TagRendererInterface::class)->addTag('twig.tag_renderer');
        $container->registerForAutoconfiguration(WorkflowInterface::class)->addTag('workflow');

        $container->registerForAutoconfiguration(EventDispatcherInterface::class)->addTag('doctrine.event_listener', ["event" => "preUpdate"]);
        $container->registerForAutoconfiguration(EventDispatcherInterface::class)->addTag('doctrine.event_listener', ["event" => "postUpdate"]);
        $container->registerForAutoconfiguration(EventDispatcherInterface::class)->addTag('doctrine.event_listener', ["event" => "prePersist"]);
        $container->registerForAutoconfiguration(EventDispatcherInterface::class)->addTag('doctrine.event_listener', ["event" => "postPersist"]);
        $container->registerForAutoconfiguration(EventDispatcherInterface::class)->addTag('doctrine.event_listener', ["event" => "preRemove"]);
        $container->registerForAutoconfiguration(EventDispatcherInterface::class)->addTag('doctrine.event_listener', ["event" => "postRemove"]);
        
    }
}
