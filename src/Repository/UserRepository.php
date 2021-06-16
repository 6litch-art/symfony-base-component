<?php

namespace Base\Repository;

use Base\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;

use Base\Database\Repository\ServiceEntityRepository;

/**
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements UserLoaderInterface
{
    public function __construct(ManagerRegistry $registry, ?string $entityClass = null)
    {
        parent::__construct($registry, $entityClass ?? User::class);
    }

    public function findByRoles(string $role)
    {
        $qb = $this->_em->createQueryBuilder();

        $qb->select('u')
        ->from('Base\Entity\User', 'u')
        ->where('u.roles LIKE :roles')
        ->setParameter('roles', '%"' . $role . '"%');

        return $qb->getQuery()->getResult();
    }

    public function loadUserByUsername(string $email) {

        return $this->getEntityManager()->createQuery(
            'SELECT u
                FROM App\Entity\User u
                OR u.email = :query'
        )
            ->setParameter('query', $email)
            ->getOneOrNullResult();
    }
}
