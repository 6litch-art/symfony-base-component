<?php

namespace Base\Database\Factory;
use Base\Service\BaseService;

use Doctrine\Common\EventManager;
use Doctrine\DBAL\Configuration;

use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;

class ConnectionFactory
{

    /**
     * @var ConnectionFactory
     */
    private $originalConnectionFactory;

    public function __construct(\Doctrine\Bundle\DoctrineBundle\ConnectionFactory $originalConnectionFactory, Security $security, BaseService $baseService)
    {
	    $this->baseService                    = $baseService;
	    $this->currentUser               = $security->getUser();
	    $this->originalConnectionFactory = $originalConnectionFactory;
    }

    /**
     * Decorates following method:
     * @see \Doctrine\Bundle\DoctrineBundle\ConnectionFactory::createConnection
     */
    public function createConnection(array $params, Configuration $config = null, EventManager $eventManager = null, array $mappingTypes = [])
    {
        $sitename = $this->getSiteNameFromRequestOrCommand();

	    $params['url'] = $this->getCredentials($sitename);
        return $this->originalConnectionFactory->createConnection($params,
            $config,
            $eventManager,
            $mappingTypes
        );
    }

}
