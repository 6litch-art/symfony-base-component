<?php

namespace Base\Repository\Sitemap\Widget;

use Base\Annotations\Annotation\EntityHierarchy;
use Base\Entity\Thread;
use Doctrine\Persistence\Event\ManagerEventArgs;
use Doctrine\Persistence\ManagerRegistry;
use Base\Repository\Traits\EntityHierarchyTrait;

use Base\Database\Repository\ServiceEntityRepository;
use Base\Repository\Sitemap\WidgetRepository;

/**
 * @method Thread|null find($id, $lockMode = null, $lockVersion = null)
 * @method Thread|null findOneBy(array $criteria, array ?array $orderBy = null)
 * @method Thread[]    findAll()
 * @method Thread[]    findBy(array $criteria, array ?array $orderBy = null, $limit = null, $offset = null)
 */

class HyperlinkRepository extends WidgetRepository
{

}