<?php

namespace Base\Database\Repository;

use BadMethodCallException;
use Base\Entity\Thread;
use Base\Entity\Thread\Tag;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\KernelEvent;

/**
 * @method Thread|null find($id, $lockMode = null, $lockVersion = null)
 * @method Thread|null findOneBy(array $criteria, array ?array $orderBy = null)
 * @method Thread[]    findAll()
 * @method Thread[]    findBy(array $criteria, array ?array $orderBy = null, $limit = null, $offset = null)
 */
class ServiceEntityRepository extends \Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository
{
    public function parseMethod($method, $arguments)
    {
        // If variable with route parameter found.
        // Extract request from the provided arguments
        $parameters = null;
        if (strpos($method, 'WithRouteParameter') !== false ) {

            $arrayOrEventOrRequest = array_shift($arguments);
            if(!is_array($arrayOrEventOrRequest)) {

                $request =
                    ($arrayOrEventOrRequest instanceof Request     ? $arrayOrEventOrRequest :
                    ($arrayOrEventOrRequest instanceof KernelEvent ? $arrayOrEventOrRequest->getRequest() : null));

                if(!$request)
                    throw new Exception("At least one parameter requires route parameter in your method call. First parameter must be either an instance of 'Request', 'KernelEvent' or 'array'");

                $arrayOrEventOrRequest = $request->attributes->get('_route_params');
            }

            $parameters = $arrayOrEventOrRequest;
        }

        // Extract method name and extra parameters
        $principalMethod = null;
        if (strpos($method, 'findBy') === 0) {
            $principalMethod = "findBy";
            $byNames = substr($method, 6);
        }

        if (strpos($method, 'findOneBy') === 0) {
            $principalMethod = "findOneBy";
            $byNames  = substr($method, 9);
        }

        if (strpos($method, 'count') === 0) {
            $principalMethod = "countBy";
            $byNames  = substr($method, 7);
        }

        if(empty($principalMethod)) {

            throw new BadMethodCallException(sprintf(
                'Undefined method "%s". The method name must start with ' .
                'either findBy, findOneBy or countBy!',
                $method
            ));
        }

        // Divide in case of multiple variable
        // Only AND operation is tolerated.. because of binary logic.
        $criteria = [];
        $byNames = explode("And", $byNames);
        foreach($byNames as $by) {

            if ($method == 'WithRouteParameter')
                throw new Exception("Missing parameter to associate with operator 'withRouteParameter'");

            $by = lcfirst($by);
            if (str_ends_with($by, 'WithRouteParameter')) {

                if(!is_string($by))
                    throw new Exception("string parameter name expected");

                $by = substr($by, 0, strlen($by) - 18);
                $key       = array_shift($arguments);
                $parameter = $parameters[$key] ?? null;

                $method = substr($method, 0, strpos($method, 'WithRouteParameter'));
                $criteria[$by] = $parameter;
                continue;
            }

            $criteria[$by] = array_shift($arguments);
        }

        // Merge with already requested criterion
        $arguments[0] = array_merge($arguments[0] ?? [], $criteria);

        // Shape return function
        return [$principalMethod, $arguments];
    }

    public function flush()
    {
        return $this->getEntityManager()->flush();
    }

    public function __call($method, $arguments)
    {
        list($method, $arguments) = $this->parseMethod($method, $arguments);
        return $this->$method(...$arguments);
    }

    public function findOneBy(array $criteria = [], ?array $orderBy = null)
    {
        $findBy = $this->findBy($criteria, $orderBy, 1) ?? [];
        return $findBy[0] ?? null;
    }

    public function findBy   (array $criteria = [], ?array $orderBy = null, $limit = null, $offset = null)
    {
        $qb = $this->createQueryBuilder('t')
            ->setMaxResults($limit ? $limit : null)
            ->setFirstResult($offset ? $offset : null);

        foreach ($orderBy ?? [] as $name => $value)
            $qb->orderBy("t.${name}", $value);

        $classMetadata  = $this->getClassMetadata($this->getEntityName());
        foreach ($criteria as $field => $value) {

            // Set parameter to be used in the condition
            $qb->setParameter("${field}", $value);

            // Regular field: string, datetime..
            if (!$classMetadata->hasAssociation($field)) {

                if(is_array($value)) $qb->andWhere("t.${field} IN (:${field})");
                else $qb->andWhere("t.${field} = :${field}");

            // Relationship field: ManyToMany,ManyToOne, OneToMany..
            } else {

                $qb->innerJoin("t.${field}", "t_${field}");
                if(is_array($value)) $qb->andWhere("t_${field} IN (:${field})");
                else $qb->andWhere("t_${field} = :${field}");
            }
        }

        return $qb->getQuery()->getResult();
    }
}
