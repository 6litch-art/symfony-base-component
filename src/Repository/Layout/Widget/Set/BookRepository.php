<?php

namespace Base\Repository\Layout\Widget\Set;

use Base\Entity\Layout\Widget\Set\Book;

use Base\Repository\Layout\WidgetRepository;

/**
 * @method Book|null find($id, $lockMode = null, $lockVersion = null)
 * @method Book|null findOneBy(array $criteria, array ?array $orderBy = null)
 * @method Book[]    findAll()
 * @method Book[]    findBy(array $criteria, array ?array $orderBy = null, $limit = null, $offset = null)
 */

class BookRepository extends WidgetRepository
{
}
