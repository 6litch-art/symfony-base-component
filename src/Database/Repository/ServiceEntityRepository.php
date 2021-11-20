<?php

namespace Base\Database\Repository;

use BadMethodCallException;
use Base\Entity\Thread;
use Base\Entity\Thread\Tag;
use DateInterval;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\PersistentCollection;
use Doctrine\ORM\Query;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use ReflectionClass;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\KernelEvent;

/**
 * @method Thread|null find($id, $lockMode = null, $lockVersion = null)
 * @method Thread|null findOneBy(array $criteria, array ?array $orderBy = null, $groupBy = null)
 * @method Thread|null findLastBy(array $criteria, array ?array $orderBy = null, $groupBy = null)
 * @method Thread[]    findAll(?array $orderBy = null, $groupBy = null)
 * @method Thread[]    findBy(array $criteria, array ?array $orderBy = null, $groupBy = null, $limit = null, $offset = null)
 */
class ServiceEntityRepository extends \Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository
{
    // Default options
    public const OPTION_EQUAL         = "EqualTo";
    public const OPTION_NOT_EQUAL     = "NotEqualTo";
    public const OPTION_GREATER       = "GreaterThan";
    public const OPTION_GREATER_EQUAL = "GreaterEqualTo";
    public const OPTION_LOWER         = "LowerThan";
    public const OPTION_LOWER_EQUAL   = "LowerEqualTo";

    // Datetime related options
    public const OPTION_OLDER         = "OlderThan";
    public const OPTION_OLDER_EQUAL   = "OlderEqualTo";
    public const OPTION_YOUNGER       = "YoungerThan";
    public const OPTION_YOUNGER_EQUAL = "YoungerEqualTo";
    public const OPTION_OVER          = "IsOver";
    public const OPTION_NOT_OVER      = "IsNotOver";

    // String related options
    public const OPTION_STARTING_WITH = "StartingWith";
    public const OPTION_ENDING_WITH   = "EndingWith";
    public const OPTION_NOT_STARTING_WITH = "NotStartingWith";
    public const OPTION_NOT_ENDING_WITH   = "NotEndingWith";

    // Custom options
    public const OPTION_INSENSITIVE   = "Insensitive";
    public const OPTION_WITH_ROUTE    = "WithRoute";
    public const OPTION_PARTIAL       = "Partial";
    public const OPTION_MODEL         = "Model";
    
    // Separators
    public const SEPARATOR     = ":"; // Field separator
    public const SEPARATOR_OR   = "Or";
    public const SEPARATOR_AND  = "And";

    // Count options
    public const MODE_ALL = "ALL";
    public const MODE_DISTINCT = "DISTINCT";

    protected $classMetaData = null;

    protected $operator = null;
    protected $column = null;
    protected array $criteria = [];
    protected array $options  = [];

    public static function getFqdnEntityName()
    {
        return preg_replace(
            ['/\\\\Repository\\\\/', '/Repository$/'],
            ["\\\\Entity\\\\", ""], 
            static::class
        );
    }

    public function __construct(ManagerRegistry $registry, ?string $entityName = null)
    {
        
        parent::__construct($registry, $entityName ?? $this->getFqdnEntityName());
    }

    protected function validateDate($date, $format = 'Y-m-d H:i:s') {

        $d = \DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) == $date;
    }

    public function  getCustomOption(string $id) { return $this->options[$id] ?? []; }
    public function findCustomOption(string $id, string $option) { return in_array($option, $this->getCustomOption($id)); }
    protected function addCustomOption(string $id, $option)
    {
        if(! array_key_exists($id, $this->criteria))
            throw new Exception("Criteria ID \"$id\" not found in criteria list.. wrong usage? use \"addCriteria\" first.");

        if(!array_key_exists($id, $this->options))
            $this->options[$id] = [];

        $this->options[$id][] = $option;
    }
    
    protected function getAlias($alias) { 

        $this->getClassMetadata()->fieldNames[$alias] ?? $alias;
        return $this->getClassMetadata()->fieldNames[$alias] ?? $alias;
    }
    
    protected function getColumn() { return $this->column; }
    
    protected function setColumn(string $column)
    {
        $this->column = $column;
        return $this;
    }

    protected function getSeparator() { return $this->operator; }
    protected function setSeparator($operator)
    {
        $this->operator = $operator;
        return $this;
    }

    protected function addCriteria(string $by, $value)
    {
        if(empty($by)) 
            throw new Exception("Tried to add unnamed criteria");

        $index = 0;
        while( array_key_exists($by . self::SEPARATOR . $index, $this->criteria) )
            $index++;

        $this->criteria[$by . self::SEPARATOR . $index] = $value;
        return $by . self::SEPARATOR . $index;
    }

    public function flush() { return $this->getEntityManager()->flush(); }
    public function persist($entity) {

        $entityName = self::getFqdnEntityName();
        if(!is_object($entity) || (!$entity instanceof $entityName && !is_subclass_of($entity, $entityName))) {
            $class = (is_object($entity) ? get_class($entity) : "null");
            throw new \Exception("Repository \"".static::class."\" is expected \"".$entityName."\" entity, you passed \"".$class."\"");
        }

        $this->getEntityManager()->persist($entity);
    }

    protected function stripByFront($method, $by, $option)
    {
        $method = substr($method, strlen($option), strlen($method));
        $by = substr($by, strlen($option), strlen($by));
        return [$method, $by];
    }

    protected function stripByEnd($method, $by, $option)
    {
        $method = substr($method, 0, strpos($method, $option));
        $by     = substr($by, 0, strlen($by) - strlen($option));
        return [$method, $by];
    }

    public function __call($method, $arguments)
    {
        // Parse method and call it
        list($method, $arguments) = $this->parseMethod($method, $arguments);
        $ret = $this->$method(...$arguments);

        // Reset internal variables
        $this->criteria = [];
        $this->options = [];
        $this->operator = null;

        return $ret;
    }

    protected function parseMethod($method, $arguments)
    {
        // Head parameters (depends on the method name) + default ones
        // Default parameters:
        // - 0: criteria
        // - 1: orderBy
        // - 2: groupBy
        // - 3: limit
        // - 4: offset
        
        // Definition of the returned values
        $magicFn = null;
        $magicArgs = [];

        // TODO: Safety check in dev mode only (maybe..)
        foreach($this->getClassMetadata()->getFieldNames() as $field) {

            if (str_contains($field, self::OPTION_WITH_ROUTE )   ||
                str_contains($field, self::OPTION_MODEL      )   ||
                str_contains($field, self::OPTION_PARTIAL    )   ||
                str_contains($field, self::OPTION_INSENSITIVE)   ||
                str_contains($field, self::OPTION_STARTING_WITH) ||
                str_contains($field, self::OPTION_ENDING_WITH)   ||
                str_contains($field, self::OPTION_NOT_STARTING_WITH) ||
                str_contains($field, self::OPTION_NOT_ENDING_WITH)   ||

                str_contains($field, self::OPTION_LOWER)         ||
                str_contains($field, self::OPTION_GREATER)       ||
                str_contains($field, self::OPTION_LOWER_EQUAL)   ||
                str_contains($field, self::OPTION_GREATER_EQUAL) ||

                str_contains($field, self::OPTION_OVER)          ||
                str_contains($field, self::OPTION_NOT_OVER)      ||
                str_contains($field, self::OPTION_YOUNGER)       ||
                str_contains($field, self::OPTION_OLDER)         ||
                str_contains($field, self::OPTION_YOUNGER_EQUAL) ||
                str_contains($field, self::OPTION_OLDER_EQUAL)   ||

                str_contains($field, self::OPTION_EQUAL)         ||
                str_contains($field, self::OPTION_NOT_EQUAL)     ||

                str_contains($field, self::SEPARATOR_AND      )  ||
                str_contains($field, self::SEPARATOR_OR       )  ||
                str_contains($field, self::SEPARATOR         ))

                throw new Exception(
                    "\"".$this->getEntityName(). "\" entity has a field called \"$field\". ".
                    "This is unfortunate, because this word is used to customize DQL queries. ".
                    "Please build your own DQL query or change your database field name"
                );
        }

        // Find and sort the "With" list
        $withs = array_filter([
            self::OPTION_WITH_ROUTE => strpos($method, self::OPTION_WITH_ROUTE)
            /* ... */
        ],fn ($value)  => ($value !== false));
        asort($withs);

        // Here are the resulting parameters
        $routeParameters = null;
        foreach(array_keys($withs) as $with) {

            switch($with) {

                // If variable with route parameter found.
                // Extract request from the provided arguments
                case self::OPTION_WITH_ROUTE:

                    $arrayOrEventOrRequest = array_shift($arguments);
                    if(!is_array($arrayOrEventOrRequest)) {

                        $request =
                            ($arrayOrEventOrRequest instanceof Request     ? $arrayOrEventOrRequest :
                            ($arrayOrEventOrRequest instanceof KernelEvent ? $arrayOrEventOrRequest->getRequest() : null));

                        if(!$request)
                            throw new Exception("At least one parameter requires route parameter in your method call. First parameter must be either an instance of 'Request', 'KernelEvent' or 'array'");

                        $arrayOrEventOrRequest = $request->attributes->get('_route_params');
                    }

                    $routeParameters = $arrayOrEventOrRequest;
                    break;

                default:
                    throw new Exception("Unexpected \"Entity\" proposition found: \"".$with."\"");
            }
        }

        // Extract method name and extra parameters
        if (preg_match('/^(find(?:One|Last)?By)(.*)/', $method, $matches)) {

            $magicFn = "__".$matches[1] ?? "";
            $method  = 
            $byNames   = $matches[2] ?? "";

        } else if (preg_match('/^(distinctCount|count)(?:For([^By]*))?(?:By){0,1}(.*)/', $method, $matches)) {
            
            $magicFn = "__".$matches[1] ?? "";
            $byNames   = $matches[3] ?? "";

            $this->setColumn(lcfirst($matches[2]) ?? null);

        } else if (preg_match('/^(lengthOf)([^By]+)(?:By){0,1}(.*)/', $method, $matches)) {
            
            $magicFn = "__".$matches[1] ?? "";
            $byNames   = $matches[3] ?? "";

            $this->setColumn(lcfirst($matches[2]) ?? null);

        } else {

            throw new Exception(sprintf(
                'Undefined method "%s". The method name must start with ' .
                'either findBy, findOneBy, findLastBy, distinctCount, count, lengthOf!',
                $method
            ));
        }

        // Reveal obvious logical ambiguities..
        if (str_contains($byNames, self::SEPARATOR_AND ) && str_contains($byNames, self::SEPARATOR_OR ))
            throw new Exception("\"".$byNames. "\" method gets an AND/OR ambiguity");

        // Desintangle logical operators
        if (str_contains($byNames, self::SEPARATOR_OR)) {

            $this->setSeparator(self::SEPARATOR_OR);
            $byNames = explode(self::SEPARATOR_OR, $byNames);

        } else {

            $this->setSeparator(self::SEPARATOR_AND);
            $byNames = explode(self::SEPARATOR_AND, $byNames);
        }

        $methodBak = $method;
        $operator = self::OPTION_EQUAL; // Default case (e.g. "findBy" alone)

        foreach($byNames as $id => $by) {

            $oldBy = null;

            $operator = self::OPTION_EQUAL;
            $isInsensitive = $isPartial = false;
            $withRoute = null;
            
            while ($oldBy != $by) {

                $oldBy = $by;

                $option = null;
                if ( str_starts_with($by, self::OPTION_PARTIAL) )
                    $option = self::OPTION_PARTIAL;
                else if ( str_starts_with($by, self::OPTION_INSENSITIVE) )
                    $option = self::OPTION_INSENSITIVE;
                    
                else if ( str_ends_with($by, self::OPTION_WITH_ROUTE) )
                    $option = self::OPTION_WITH_ROUTE;

                else if ( str_ends_with($by, self::OPTION_STARTING_WITH) )
                    $option = self::OPTION_STARTING_WITH;
                else if ( str_ends_with($by, self::OPTION_ENDING_WITH) )
                    $option = self::OPTION_ENDING_WITH;
                else if ( str_ends_with($by, self::OPTION_NOT_STARTING_WITH) )
                    $option = self::OPTION_NOT_STARTING_WITH;
                else if ( str_ends_with($by, self::OPTION_NOT_ENDING_WITH) )
                    $option = self::OPTION_NOT_ENDING_WITH;
                
                else if ( str_ends_with($by, self::OPTION_LOWER_EQUAL) )
                    $option = self::OPTION_LOWER_EQUAL;
                else if ( str_ends_with($by, self::OPTION_LOWER) )
                    $option = self::OPTION_LOWER;
                
                else if ( str_ends_with($by, self::OPTION_GREATER_EQUAL) )
                    $option = self::OPTION_GREATER_EQUAL;
                else if ( str_ends_with($by, self::OPTION_GREATER) )
                    $option = self::OPTION_GREATER;
                
                else if ( str_ends_with($by, self::OPTION_NOT_EQUAL) )
                    $option = self::OPTION_NOT_EQUAL;
                else if ( str_ends_with($by, self::OPTION_EQUAL) )
                    $option = self::OPTION_EQUAL;

                else if ( str_ends_with($by, self::OPTION_YOUNGER) )
                    $option = self::OPTION_YOUNGER;
                else if ( str_ends_with($by, self::OPTION_YOUNGER_EQUAL) )
                    $option = self::OPTION_YOUNGER_EQUAL;
                else if ( str_ends_with($by, self::OPTION_OLDER) )
                    $option = self::OPTION_OLDER;
                else if ( str_ends_with($by, self::OPTION_OLDER_EQUAL) )
                    $option = self::OPTION_OLDER_EQUAL;

                switch($option) {

                    case self::OPTION_PARTIAL:
                        $isPartial = true;
                        list($method, $by) = $this->stripByFront($method, $by, $option);
                        break;

                    case self::OPTION_INSENSITIVE:
                        $isInsensitive = true;
                        list($method, $by) = $this->stripByFront($method, $by, $option);
                        break;

                    case self::OPTION_WITH_ROUTE:
                        $withRoute = true;
                        list($method, $by) = $this->stripByEnd($method, $by, self::OPTION_WITH_ROUTE);
                        break;

                    // String related
                    case self::OPTION_STARTING_WITH:
                    case self::OPTION_ENDING_WITH:
                    case self::OPTION_NOT_STARTING_WITH:
                    case self::OPTION_NOT_ENDING_WITH:
                    
                    // Datetime related
                    case self::OPTION_YOUNGER:
                    case self::OPTION_YOUNGER_EQUAL:
                    case self::OPTION_OLDER:
                    case self::OPTION_OLDER_EQUAL:
                    case self::OPTION_OVER:
                    case self::OPTION_NOT_OVER:
                    
                    // Number related
                    case self::OPTION_LOWER:
                    case self::OPTION_LOWER_EQUAL:
                    case self::OPTION_GREATER:
                    case self::OPTION_GREATER_EQUAL:
                    case self::OPTION_EQUAL:
                    case self::OPTION_NOT_EQUAL:
                        $operator = $option;
                        list($method, $by) = $this->stripByEnd($method, $by, $option);
                        break;
                }
            }

            if(empty($by))
                throw new Exception("Malformed magic method. \"$methodBak\" cannot be parsed.. unknown name for parameter #".($id+1));

            // First check if WithRoute special argument is found..
            // This argument will retrieve the value of the corresponding route parameter
            // and use it in the query
            if ($withRoute) {

                $key    = array_shift($arguments);

                // Stop dev using partial information when using route parameter
                // Doing so.. user would be able to inject LIKE commands directly from URL..
                if($isPartial)
                    throw new Exception("Partial field \"$by\" using route parameter is not implemented. Consider removing \"Partial\" prefix from \"$methodBak\"");

                // Process self::OPTION_WITH_ROUTE method
                if ($method == self::OPTION_WITH_ROUTE)
                    throw new Exception("Missing parameter to associate with operator 'withRouteParameter'");
                    
                $fieldValue = $routeParameters[$key] ?? null;
                if(!empty($fieldValue)) {

                    // Check if partial match is enabled
                    $by = lcfirst($by);

                    $id = $this->addCriteria($by, $fieldValue);
                    if ($operator == self::OPTION_EQUAL) $this->addCustomOption($id, $operator);
                    else throw new Exception("Unexpected operator \"".$operator."\" found in model definition");    
                }

            } else if ($by == self::OPTION_MODEL) {

                list($method, $_) = $this->stripByEnd($method, $by, $option);
                $method = substr($method, 0, strpos($method, self::OPTION_MODEL));
                $by = lcfirst($by);

                $modelCriteria = [];
                $model = array_shift($arguments);
                
                if(is_object($model)) {

                    $reflClass = new ReflectionClass(get_class($model));
                    foreach ($reflClass->getProperties() as $field) {

                        $fieldName = $field->getName();
                        $field->setAccessible(true);

                        if (!$field->isInitialized($model)) continue;
                        if (!($fieldValue = $field->getValue($model)) ) continue;

                        if ($this->getClassMetadata()->hasAssociation($fieldName)) {

                            $associationField = $this->getClassMetadata()->getAssociationMapping($fieldName);
                            if (!array_key_exists("targetEntity", $associationField) || $field->getType() != $associationField["targetEntity"])
                                throw new Exception("Invalid association mapping \"$fieldName\" found (found \"".$field->getType()."\", expected type \"". $associationField["targetEntity"]."\") in \"" . $this->getEntityName() . "\" entity, \"" . $reflClass->getName() . " cannot be applied\"");

                        } else if(!$this->getClassMetadata()->hasField($fieldName))
                            throw new Exception("No field \"$fieldName\" (or association mapping) found in \"".$this->getEntityName(). "\" entity, \"".$reflClass->getName()." cannot be applied\"");

                        if (( $fieldValue = $field->getValue($model) ))
                            $modelCriteria[$fieldName] = $fieldValue;
                    }

                } else if(is_array($model)) {

                    $modelCriteria = $model;

                } else {
                    
                    throw new Exception("Model expected to be an object or an array, currently \"". gettype($model)."\"");
                }

                if(!empty($modelCriteria)) {

                    $id = $this->addCriteria($by, $modelCriteria);
                    if ($isPartial) $this->addCustomOption($id, self::OPTION_PARTIAL);
                    if ($isInsensitive) $this->addCustomOption($id, self::OPTION_INSENSITIVE);
                    
                    if ($operator == self::OPTION_EQUAL || $operator == self::OPTION_NOT_EQUAL) $this->addCustomOption($id, $operator);
                    else throw new Exception("Unexpected operator \"".$operator."\" found in model definition");
                }

            } else if($by) {

                $by = lcfirst($by);
                
                $fieldExpected = ($operator == self::OPTION_OVER || $operator == self::OPTION_NOT_OVER);
                $fieldValue = ($fieldExpected ? "CURDATE()" : array_shift($arguments));
                
                $id = $this->addCriteria($by, $fieldValue);
                if ($isPartial) $this->addCustomOption($id, self::OPTION_PARTIAL);
                if ($isInsensitive) $this->addCustomOption($id, self::OPTION_INSENSITIVE);
                if ($operator) $this->addCustomOption($id, $operator);
            }
        }

        // Index definition:
        // "criteria"  = argument #0, after removal of head parameters
        foreach($arguments as $i => $arg) $magicArgs[$i] = $arg;

        $magicArgs[0] = array_merge($magicArgs[0] ?? [], $this->criteria ?? []);

        // Shaped return
        return [$magicFn, $magicArgs];
    }

    protected function buildQueryExpr(QueryBuilder $qb, $field, $fieldValue)
    {
        $fieldName = $this->getAlias($field[0]);
        $fieldID   = implode("_", $field);
        $fieldRoot = implode(self::SEPARATOR, array_slice($field, count($field) - 2, 2));
        
        $isPartial     = $this->findCustomOption($fieldRoot, self::OPTION_PARTIAL);
        $isInsensitive = $this->findCustomOption($fieldRoot, self::OPTION_INSENSITIVE);
        $tableOperator =
            // Datetime related options
            ($this->findCustomOption ($fieldRoot, self::OPTION_OVER)          ? self::OPTION_OVER          :
            ($this->findCustomOption ($fieldRoot, self::OPTION_NOT_OVER)      ? self::OPTION_NOT_OVER      :
            ($this->findCustomOption ($fieldRoot, self::OPTION_OLDER)         ? self::OPTION_OLDER         :
            ($this->findCustomOption ($fieldRoot, self::OPTION_OLDER_EQUAL)   ? self::OPTION_OLDER_EQUAL   :
            ($this->findCustomOption ($fieldRoot, self::OPTION_YOUNGER)       ? self::OPTION_YOUNGER       :
            ($this->findCustomOption ($fieldRoot, self::OPTION_YOUNGER_EQUAL) ? self::OPTION_YOUNGER_EQUAL :

            // String related options
            ($this->findCustomOption ($fieldRoot, self::OPTION_STARTING_WITH)     ? self::OPTION_STARTING_WITH :
            ($this->findCustomOption ($fieldRoot, self::OPTION_ENDING_WITH)       ? self::OPTION_ENDING_WITH   :
            ($this->findCustomOption ($fieldRoot, self::OPTION_NOT_STARTING_WITH) ? self::OPTION_NOT_STARTING_WITH :
            ($this->findCustomOption ($fieldRoot, self::OPTION_NOT_ENDING_WITH)   ? self::OPTION_NOT_ENDING_WITH   :

            // Number related options
            ($this->findCustomOption ($fieldRoot, self::OPTION_GREATER)       ? self::OPTION_GREATER       :
            ($this->findCustomOption ($fieldRoot, self::OPTION_GREATER_EQUAL) ? self::OPTION_GREATER_EQUAL :
            ($this->findCustomOption ($fieldRoot, self::OPTION_LOWER)         ? self::OPTION_LOWER         :
            ($this->findCustomOption ($fieldRoot, self::OPTION_LOWER_EQUAL)   ? self::OPTION_LOWER_EQUAL   : 
            ($this->findCustomOption ($fieldRoot, self::OPTION_NOT_EQUAL)     ? self::OPTION_NOT_EQUAL     : self::OPTION_EQUAL
        )))))))))))))));

        if(is_array($tableOperator))
            throw new Exception("Too many operator requested for \"$fieldName\": ".implode(",", $tableOperator));

        // Regular field: string, datetime..
        if (!$this->getClassMetadata()->hasAssociation($fieldName)) { 

            $tableColumn = "t.${fieldName}";

        } else { // Relationship field: ManyToMany,ManyToOne, OneToMany..

            $tableColumn = "t_${fieldName}";
            $qb = $this->innerJoin($qb, $fieldName);
        }

        // Time related operation
        if(is_string($fieldValue)) {

            $fieldValue = str_replace(["_", "\%"], ["\_", "\%"], $fieldValue);

            $datetimeRequested = in_array($tableOperator, [self::OPTION_OVER, self::OPTION_NOT_OVER, self::OPTION_OLDER, self::OPTION_OLDER_EQUAL, self::OPTION_YOUNGER, self::OPTION_YOUNGER_EQUAL]);
            if($datetimeRequested) {

                if(in_array($tableOperator, [self::OPTION_OVER, self::OPTION_NOT_OVER])) $fieldValue = new \DateTime("now");
                else if($this->validateDate($fieldValue) || $fieldValue instanceof \DateTime) $fieldValue = new \DateTime($fieldValue);
                else if(in_array($tableOperator, [self::OPTION_YOUNGER, self::OPTION_YOUNGER_EQUAL])) {

                    $subtract = strtr($fieldValue, ["+" => "-", "-" => "+"]);
                    $fieldValue = (new \DateTime("now"))->modify($subtract);
                }
            }

            $regexRequested = in_array($tableOperator, [self::OPTION_STARTING_WITH, self::OPTION_ENDING_WITH, self::OPTION_NOT_STARTING_WITH, self::OPTION_NOT_ENDING_WITH]);
            if($regexRequested) {

                    if($tableOperator == self::OPTION_STARTING_WITH    ) $fieldValue = $fieldValue."%";
                else if($tableOperator == self::OPTION_ENDING_WITH      ) $fieldValue = "%".$fieldValue;
                else if($tableOperator == self::OPTION_NOT_STARTING_WITH) $fieldValue = $fieldValue."%";
                else if($tableOperator == self::OPTION_NOT_ENDING_WITH  ) $fieldValue = "%".$fieldValue;

                $fieldValue = ($isInsensitive ? strtolower($fieldValue) : $fieldValue);
            }
        }

        $qb->setParameter($fieldID, $fieldValue);

        if ($isInsensitive) $tableColumn = "LOWER(" . $tableColumn . ")";
        if ($isPartial) {

            if($tableOperator != self::OPTION_EQUAL && $tableOperator != self::OPTION_NOT_EQUAL)
                throw new Exception("Invalid operator for association field \"$fieldName\": ".$tableOperator);

            // Cast to array
            if (!is_array($fieldValue)) $fieldValue = [$fieldValue];

            $expr = [];
            foreach ($fieldValue as $entryID => $entry) {

                $fnExpr = ($tableOperator == self::OPTION_EQUAL ? "like" : "notLike");
                $expr[] = $qb->expr()->$fnExpr($tableColumn, ":$fieldID");
            }

            $fnExpr = ($tableOperator == self::OPTION_EQUAL ? "orX" : "andX");
            return $qb->expr()->$fnExpr(...$expr);

        } else if (is_array($fieldValue)) {

                 if($tableOperator == self::OPTION_EQUAL)     $tableOperator = "IN";
            else if($tableOperator == self::OPTION_NOT_EQUAL) $tableOperator = "NOT IN";
            else throw new Exception("Invalid operator for field \"$fieldName\": ".$tableOperator);

            return "${tableColumn} ${tableOperator} (:${fieldID})";
            
        } else if($regexRequested) {
        
                 if($tableOperator == self::OPTION_STARTING_WITH) $tableOperator = "like";
            else if($tableOperator == self::OPTION_ENDING_WITH)   $tableOperator = "like";
            else if($tableOperator == self::OPTION_NOT_STARTING_WITH)  $tableOperator = "notLike";
            else if($tableOperator == self::OPTION_NOT_ENDING_WITH)    $tableOperator = "notLike";

            return $qb->expr()->$tableOperator($tableColumn, ":$fieldID");

        } else {
            
                 if($tableOperator == self::OPTION_EQUAL)         $tableOperator = "=";
            else if($tableOperator == self::OPTION_NOT_EQUAL)     $tableOperator = "!=";
            else if($tableOperator == self::OPTION_GREATER)       $tableOperator = ">";
            else if($tableOperator == self::OPTION_GREATER_EQUAL) $tableOperator = ">=";
            else if($tableOperator == self::OPTION_LOWER)         $tableOperator = "<";
            else if($tableOperator == self::OPTION_LOWER_EQUAL)   $tableOperator = "<=";
            else if($tableOperator == self::OPTION_YOUNGER)       $tableOperator = ">";
            else if($tableOperator == self::OPTION_YOUNGER_EQUAL) $tableOperator = ">=";
            else if($tableOperator == self::OPTION_OLDER)         $tableOperator = "<";
            else if($tableOperator == self::OPTION_OLDER_EQUAL)   $tableOperator = "<=";
            else if($tableOperator == self::OPTION_OVER)          $tableOperator = "<=";
            else if($tableOperator == self::OPTION_NOT_OVER)      $tableOperator = ">";
            else throw new Exception("Invalid operator for field \"$fieldName\": ".$tableOperator);

            return "${tableColumn} ${tableOperator} :{$fieldID}";
        }

        throw new Exception("Failed to build expression \"".$field."\": ".$fieldValue);
    }

    protected function getQueryBuilder(array $criteria = [], $orderBy = null, $groupBy = null, $limit = null, $offset = null)
    {
        $qb = $this->createQueryBuilder('t')
                   ->setMaxResults($limit ?? null)
                   ->setFirstResult($offset ?? null);

        $this->innerJoinList[spl_object_hash($qb)] = [];

        // Prepare criteria variable
        foreach ($criteria as $field => $fieldValue) {

            $field     = explode(self::SEPARATOR, $field);
            $fieldName = $field[0];

            if($fieldValue instanceof PersistentCollection)
                 throw new Exception("You passed a PersistentCollection for field \"".$fieldName."\"");

            // Handle partial entity/model input criteria
            if($fieldName == lcfirst(self::OPTION_MODEL)) {
                
                $expr = [];
                foreach ($fieldValue as $entryID => $entryValue) {

                    $newField = [];
                    foreach ($field as $key => $value) $newField[$key] = $value;
                    array_unshift($newField, $entryID);

                    $queryExpr = $this->buildQueryExpr($qb, $newField, $entryValue);

                    // In case of association field, compare value directly
                    if ($this->getClassMetadata()->hasAssociation($entryID)) $qb->andWhere($queryExpr);
                    // If standard field, check for partial information
                    else $expr[] = $queryExpr;
                }

                $expr = $qb->expr()->orX(...$expr);

            } else {

                //Default query builder
                $expr = $this->buildQueryExpr($qb, $field, $fieldValue);
            }

            // Set logical operator
            switch ($this->getSeparator()) {

                case self::SEPARATOR_OR: $qb->orWhere($expr);
                    break;

                default:
                case self::SEPARATOR_AND: $qb->andWhere($expr);
                    break;
            }
        }

        // Sort result by group
        if($groupBy) $qb->select("t as entity");
        else $qb->select("t");

        $qb = $this->orderBy($qb, $orderBy);
        $qb = $this->groupBy($qb, $groupBy);
        
        return $qb;
    }

    protected function groupBy($qb, $groupBy)
    {
        if($groupBy) {

            $column = explode("\\", $this->getEntityName());
            $column = lcfirst(end($column));

            if(is_string($groupBy)) $groupBy = [$groupBy];
            if(!is_array($groupBy)) throw new Exception("Unexpected \"groupBy\" argument type provided \"".gettype($groupBy)."\"");

            foreach ($groupBy as $name => $value) {

                $alias = str_replace(".", "_", $value);
                $value = implode(".", array_map(fn ($value) => $this->getAlias($value), explode(".", $value)));

                $firstValue = explode(".", $value)[0] ?? $value;
                $groupBy[$name] = $this->getClassMetadata()->hasAssociation($firstValue) ? "t_".$value : "t.".$value;
                
                if($groupBy[$name] == "t.".$alias) $qb->addSelect($groupBy[$name]);
                else $qb->addSelect("(".$groupBy[$name].") AS ".$alias);

                $qb = $this->innerJoin($qb, $alias);
            }

            $qb->groupBy(implode(",", $groupBy));
        }

        return $qb;
    }

    protected $innerJoinList = [];
    protected function innerJoin($qb, $innerJoin)
    {
        if(in_array($innerJoin, $this->innerJoinList[spl_object_hash($qb)])) return $qb;
        if ($this->getClassMetadata()->hasAssociation($innerJoin)) {

            $qb->innerJoin("t.".$innerJoin, "t_".$innerJoin);
            $this->innerJoinList[spl_object_hash($qb)][] = $innerJoin;
        }

        return $qb;
    }

    protected function orderBy($qb, $orderBy)
    {
        if($orderBy) {

            $column = explode("\\", $this->getEntityName());
            $column = lcfirst(end($column));

            if(is_string($orderBy)) $orderBy = [$orderBy => "ASC"];
            if(!is_array($orderBy)) throw new Exception("Unexpected \"orderBy\" argument type provided \"".gettype($orderBy)."\"");

            foreach ($orderBy as $name => $value) {

                $path = array_map(fn ($name) => $this->getAlias($name), explode(".", $name));
                $name = implode(".", $path);
                $entity = $path[0];

                $formattedName = $this->getClassMetadata()->hasAssociation($entity) ? "t_".$name : "t.".$name;
                $qb = $this->innerJoin($qb, $entity);

                $qb->orderBy($formattedName, $value);
            }

        }

        return $qb;
    }

    protected function __findBy(array $criteria = [], $orderBy = null, $groupBy = null, $limit = null, $offset = null): ?Query
    {
        return $this->getQueryBuilder($criteria, $orderBy, $groupBy, $limit, $offset)->getQuery();
    }
    protected function __findLastBy(array $criteria = [], $orderBy = null, $groupBy = null)
    {
        return $this->__findOneBy($criteria, array_merge($orderBy ?? [], ['id' => 'DESC']), $groupBy, 1, null) ?? null;
    }
    protected function __findOneBy(array $criteria = [], $orderBy = null, $groupBy = null)
    {
        return $this->__findBy($criteria, $orderBy, $groupBy, 1, null)->getOneOrNullResult();
    }
    protected function __distinctCount(array $criteria, $groupBy = null): int
    {
        return $this->__count($criteria, self::MODE_DISTINCT, $groupBy);
    }

    protected function __count(array $criteria, ?string $mode = "", ?array $orderBy = null, $groupBy = null)
    {
        if($mode == self::MODE_ALL) $mode = "";
        if($mode && $mode != self::MODE_DISTINCT)
            throw new Exception("Unexpected \"mode\" provided: \"". $mode."\"");
        $column = $this->getAlias($this->getColumn());
        $qb = $this->getQueryBuilder($criteria, $orderBy, $groupBy);
        $this->innerJoin($qb, $column);

        $column = ($this->getClassMetadata()->hasAssociation($column) ? "t_".$column : "t");
        $qb->select('COUNT('.trim($mode.' '.$column).') AS count');
        
        $this->orderBy($qb, $orderBy);
        $this->groupBy($qb, $groupBy);

        $fnResult = ($groupBy ? "getResult" : "getSingleScalarResult");
        return $qb->getQuery()->$fnResult();
    }
    
    protected function __lengthOf(array $criteria = [], $orderBy = null, $groupBy = null, $limit = null, $offset = null)
    {
        $column = $this->getAlias($this->getColumn());
        $column = ($this->getClassMetadata()->hasAssociation($column) ? "t_".$column : "t");

        $qb = $this->getQueryBuilder($criteria, $orderBy, $groupBy, $limit, $offset);
        $this->innerJoin($qb, $column);

        $qb->select("LENGTH(t.".$column.") as length");
        
        $this->orderBy($qb, $orderBy);
        $this->groupBy($qb, $groupBy);

        return $qb->getQuery()->getResult();
    }
}
