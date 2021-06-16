<?php

namespace Base;

use Base\Entity\User;

use Base\Type\UTCDateTimeType;
use Symfony\Bundle\FrameworkBundle\HttpCache\HttpCache;
use Symfony\Component\HttpFoundation\Session\Session;

class Kernel extends HttpCache
{
    public function __construct(string $environment, bool $debug)
    {
        // Load default kernel
        $kernel = new \App\Kernel($environment, $debug);

        // Forward to HttpCache
        parent::__construct($kernel);

        // Start session here to access client information
        $timezone = User::getCookie("timezone");
        if( !in_array($timezone, timezone_identifiers_list()) )
            $timezone = "UTC";

        // Set default time to UTC everywhere
        date_default_timezone_set($timezone ?? "UTC");

        \Doctrine\DBAL\Types\Type::overrideType('date', UTCDateTimeType::class);
        \Doctrine\DBAL\Types\Type::overrideType('datetime', UTCDateTimeType::class);
        \Doctrine\DBAL\Types\Type::overrideType('datetimetz', UTCDateTimeType::class);
    }
}
