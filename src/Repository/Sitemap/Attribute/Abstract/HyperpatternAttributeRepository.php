<?php

namespace Base\Repository\Sitemap\Attribute\Abstract;

use Base\Entity\Sitemap\Attribute\Abstract\HyperpatternAttribute;

use Base\Repository\Sitemap\AttributeRepository;

/**
 * @method HyperpatternAttribute|null find($id, $lockMode = null, $lockVersion = null)
 * @method HyperpatternAttribute|null findOneBy(array $criteria, array ?array $orderBy = null)
 * @method HyperpatternAttribute[]    findAll()
 * @method HyperpatternAttribute[]    findBy(array $criteria, array ?array $orderBy = null, $limit = null, $offset = null)
 */

class HyperpatternAttributeRepository extends AttributeRepository
{

}