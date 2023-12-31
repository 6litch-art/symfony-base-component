<?php

namespace Base\Controller;

use Base\Service\SitemapperInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

use Base\Traits\BaseTrait;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class SitemapController extends AbstractController
{
    use BaseTrait;

    /**
     * @Route("/sitemap.{extension}", name="app_sitemap", requirements={"extension"="xml|txt"})
     */
    public function Main(string $extension, Request $request, SitemapperInterface $sitemap): Response
    {
        $hostname = $request->getSchemeAndHttpHost();

        return $sitemap
            ->setHostname($hostname)
            ->registerAnnotations()
            ->serve('sitemap.'.$extension.'.twig');
    }
}
