<?php

namespace Base\Controller\Client\Legals;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class TermsController extends AbstractController
{
    /**
     * Link to this controller to read the terms of use
     *
     * @Route("/terms", name="base_terms")
     */
    public function Main(): Response
    {
        return $this->render('client/legals/terms.html.twig');
    }
}

?>
