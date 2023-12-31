<?php

namespace Base\Database\Walker;

use Doctrine\ORM\Query\SqlWalker;

class MysqlWalker extends SqlWalker
{
    public const HINT_NO_CACHE = "mysql.no_cache";
    /**
    * Walks down a SelectClause AST node, thereby generating the appropriate SQL.
    *
    * @param $selectClause
    * @return string The SQL.
    */
    public function walkSelectClause($selectClause)
    {
        $sql = parent::walkSelectClause($selectClause);

        if ($this->getQuery()->getHint(self::HINT_NO_CACHE) === true) {
            if ($selectClause->isDistinct) {
                $sql = str_replace('SELECT DISTINCT', 'SELECT DISTINCT SQL_NO_CACHE', $sql);
            } else {
                $sql = str_replace('SELECT', 'SELECT SQL_NO_CACHE', $sql);
            }
        }

        return $sql;
    }
}
