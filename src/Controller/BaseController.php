<?php

namespace Base\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Kernel;

use  Base\Service\BaseService;

class BaseController extends AbstractController
{
    public static $foundBaseService       = false;
    public static $foundBaseSubscriber    = false;
    public static $foundBaseTwigExtension = false;

    private $service;
    public function __construct(BaseService $service) {

        $this->service = $service;
    }

    /**
     * Controller example
     *
     * @Route("/", name="base_homepage")
     */
    public function Main(): Response
    {
        $version = Kernel::VERSION;
        $projectDir = \dirname(__DIR__);
        $docVersion = substr(Kernel::VERSION, 0, 3);

        $BaseFound = [
            "service" => BaseController::$foundBaseService,
            "subscriber" => BaseController::$foundBaseSubscriber,
            "twig" => BaseController::$foundBaseTwigExtension
        ];

        ob_start();
        include \dirname(__DIR__).'/Resources/views/welcome.html.php';
        return new Response(ob_get_clean(), Response::HTTP_NOT_FOUND);
    }
}