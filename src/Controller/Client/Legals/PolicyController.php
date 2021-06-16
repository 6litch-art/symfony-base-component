<?php

namespace Base\Controller\Client\Legals;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class PolicyController extends AbstractController
{
    /**
     * Link to this controller to read the policy
     *
     * @Route("/policy", name="base_policy")
     */
    public function Main(): Response
    {
        return $this->render('client/legals/policy.html.twig');
    }
}

?>
