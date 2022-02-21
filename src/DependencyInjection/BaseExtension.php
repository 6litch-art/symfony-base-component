<?php

namespace Base\DependencyInjection;

use Base\Annotations\AnnotationInterface;
use Base\Database\Factory\EntityExtensionInterface;
use Base\Model\IconProviderInterface;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\XmlFileLoader;

use Symfony\Component\Config\Definition\Processor;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;

class BaseExtension extends Extension
{
    /**
     * {@inheritdoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        //
        // Load service declaration (includes services, controllers,..)

        // Format XML
        $loader = new XmlFileLoader($container, new FileLocator(\dirname(__DIR__, 2).'/config'));
        $loader->load('services.xml');
        $loader->load('services-public.xml');
        $loader->load('services-fix.xml');

        // Configuration file: ./config/package/base.yaml
        $processor = new Processor();
        $configuration = new BaseConfiguration();
        $config = $processor->processConfiguration($configuration, $configs);
        $this->setConfiguration($container, $config, $configuration->getTreeBuilder()->getRootNode()->getNode()->getName());

        // Override and merge form_themes.. to add some features..
        $container->setParameter('twig.form.resources', array_merge(
            $config["twig"]["form_themes"],
            $container->getParameter('twig.form.resources')
        ));

        $container->registerForAutoconfiguration(EntityExtensionInterface::class)->addTag('base.entity_extension');
        $container->registerForAutoconfiguration(AnnotationInterface::class)->addTag('base.annotation');
        $container->registerForAutoconfiguration(IconProviderInterface::class)->addTag('base.icon_provider');
    }

    public function setConfiguration(ContainerBuilder $container, array $config, $globalKey = "")
    {
        foreach ($config as $key => $value) {

            if (!empty($globalKey)) $key = $globalKey . "." . $key;

            if (is_array($value)) $this->setConfiguration($container, $value, $key);
            else $container->setParameter($key, $value);
        }
    }
}
