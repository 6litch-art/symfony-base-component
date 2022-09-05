<?php

namespace Base\Database\Walker;

use Base\Database\Mapping\NamingStrategy;
use Base\Database\TranslatableInterface;
use Base\Database\TranslationInterface;
use Base\DatabaseSubscriber\IntlSubscriber;
use Doctrine\ORM\Query;
use Base\Service\LocaleProvider;
use Doctrine\ORM\Query\SqlWalker;
use Doctrine\ORM\Query\AST;
use Doctrine\ORM\Query\AST\SelectStatement;
use Doctrine\ORM\Query\Exec\SingleSelectExecutor;
use RuntimeException;

class TranslatableWalker extends SqlWalker
{
    public function __construct($query, $parserResult, array $queryComponents)
    {
        parent::__construct($query, $parserResult, $queryComponents);
        $this->localeProvider = $this->getLocaleProvider();
    }

    /**
     * @return Query\Exec\AbstractSqlExecutor
     */
    public function getExecutor($AST)
    {
        if (!$AST instanceof SelectStatement)
            return parent::getExecutor($AST);

        return new SingleSelectExecutor($AST, $this);
    }

    public function walkFromClause($fromClause): string
    {
        $sql = parent::walkFromClause($fromClause);
        $statements = explodeByArray([" LEFT JOIN", " INNER JOIN", "translatable_id"], $sql, true);
        $statementsIntls = [];

        $translatableIds = array_keys($statements, "translatable_id");
        for($i = 0, $N = count($translatableIds); $i < $N; $i++) {

            $offset = $i > 0 ? $translatableIds[$i-1]+1 : 0;
            $length = $i > 0 ? $translatableIds[$i]-$translatableIds[$i-1]-1 : $translatableIds[$i];

            $statementsIntl = array_slice($statements, $offset, $length);
            $statementsIntl[count($statementsIntl) - 1] .= "translatable_id";

            $statementsIntls[] = $statementsIntl;
        }

        if(empty($statementsIntls)) return $sql;
        if(count($statements) != end($translatableIds))
            $statementsIntls[] = array_slice($statements, $translatableIds[$i-1]+1);

        $sql = "";
        foreach($statementsIntls as $statementsIntl) {

            usort_startsWith($statementsIntl, [" FROM", " INNER JOIN", " LEFT JOIN"]);

            $statementsIntl = array_reverseByMask($statementsIntl,
                array_map(fn($s) => str_starts_with($s, " LEFT JOIN") && str_contains($s, NamingStrategy::TABLE_I18N_SUFFIX),
                $statementsIntl)
            );

            $sql .= implode("", $statementsIntl);
        }

        return $sql;
    }

    protected function getLocaleProvider(): LocaleProvider
    {
        foreach ($this->getEntityManager()->getEventManager()->getListeners() as $event => $listeners) {

            foreach ($listeners as $listener) {

                if ($listener instanceof IntlSubscriber)
                    return $listener->getLocaleProvider();
            }
        }

        throw new RuntimeException('Locale provider not found.');
    }

    public function walkJoinAssociationDeclaration($joinAssociationDeclaration, $joinType = AST\Join::JOIN_TYPE_INNER, $condExpr = null): string
    {
        $sql = parent::walkJoinAssociationDeclaration($joinAssociationDeclaration, $joinType, $condExpr);
        $dqlAlias       = $joinAssociationDeclaration->joinAssociationPathExpression->identificationVariable;
        $joinedDqlAlias = $joinAssociationDeclaration->aliasIdentificationVariable;

        $relation       = $this->getQueryComponent($joinedDqlAlias)['relation'] ?? null;
        if($relation === null) return $sql;

        // Extract source class information
        $sourceClass      = $this->getEntityManager()->getClassMetadata($relation['sourceEntity']);
        if(!class_implements_interface($sourceClass->getName(), TranslatableInterface::class))
            return $sql;

        // Get target class
        $targetClass     = $this->getEntityManager()->getClassMetadata($relation['targetEntity']);
        if(!class_implements_interface($targetClass->getName(), TranslationInterface::class))
            return $sql;

        //
        // Check whether target class is the root translation entity or not
        $assoc = !$relation['isOwningSide'] ? $targetClass->associationMappings[$relation['mappedBy']] : $relation;
        if(!array_key_exists("inherited", $assoc))
            return $sql;

        // Get root target class to replace target class 'translation_id'
        $rootTargetClass = $this->getEntityManager()->getClassMetadata($assoc['inherited']);
        if(!class_implements_interface($rootTargetClass->getName(), TranslationInterface::class))
            return $sql;

        // Get source alias and its intl alias
        $sourceTableAlias = $this->getSQLTableAlias($sourceClass->getTableName(), $dqlAlias);
        $sourceIntlTableAlias = $this->getSQLTableAlias($targetClass->getTableName(), $joinedDqlAlias);

        //
        // Use `translatable_id` from root translation entity.
        $rootIntlTableAlias = $this->getSQLTableAlias($rootTargetClass->getTableName(), $joinedDqlAlias);
        $sql = str_replace(
            $sourceIntlTableAlias.".id = ".$rootIntlTableAlias.".id",
            $sourceTableAlias.".id = ".$rootIntlTableAlias.".translatable_id", $sql
        );

        //
        // Replace target family clause accordingly to root translation entity ID.
        $intlFamilyClass = array_map(fn($c) => $this->getEntityManager()->getClassMetadata($c), get_family_class($targetClass->getName()));
        foreach($intlFamilyClass as $currentClass) {

            $intlTableAlias = $this->getSQLTableAlias($currentClass->getTableName(), $joinedDqlAlias);

            if($intlTableAlias == $rootIntlTableAlias) continue;
            if($intlTableAlias == $sourceIntlTableAlias) {

                $sql = str_replace(
                    $sourceTableAlias.".id = ".$sourceIntlTableAlias.".translatable_id",
                    $sourceIntlTableAlias.".id = ".$rootIntlTableAlias.".id", $sql
                );

            } else {

                $sql = str_replace(
                    $sourceIntlTableAlias.".id = ".$intlTableAlias.".id",
                    $intlTableAlias.".id = ".$rootIntlTableAlias.".id", $sql
                );
            }
        }

        return $sql;
    }
}