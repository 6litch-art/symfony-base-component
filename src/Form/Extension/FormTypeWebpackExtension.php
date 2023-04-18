<?php

namespace Base\Form\Extension;

use Base\Form\FormProxyInterface;
use Base\Twig\Renderer\Adapter\EncoreTagRenderer;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;

class FormTypeWebpackExtension extends AbstractTypeExtension
{
    /**
     * @var FormProxyInterface
     */
    protected $formProxy;

    /**
     * @var EncoreTagRenderer
     */
    protected $encoreTagRenderer;

    public function __construct(FormProxyInterface $formProxy, EncoreTagRenderer $encoreTagRenderer)
    {
        $this->formProxy    = $formProxy;
        $this->encoreTagRenderer = $encoreTagRenderer;
    }

    /**
     * {@inheritdoc}
     */
    public static function getExtendedTypes(): iterable
    {
        return [FormType::class];
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'webpack_entry' => null
        ]);
    }

    public function finishView(FormView $view, FormInterface $form, array $options)
    {
        $this->browseView($view, $form, $options);
    }

    public function browseView(FormView $view, FormInterface $form, array $options)
    {
        if ($options["webpack_entry"] ?? false) {
            $this->encoreTagRenderer->markAsOptional($options["webpack_entry"], false);
        }

        foreach ($view->children as $field => $childView) {
            if (!$form->has($field)) {
                continue;
            }

            $childForm = $form->get($field);
            $childOptions = $childForm->getConfig()->getOptions();
            if ($childOptions["webpack_entry"] ?? false) {
                $this->encoreTagRenderer->markAsOptional($childOptions["webpack_entry"], false);
            }

            $this->browseView($childView, $childForm, $childOptions);
        }
    }
}
