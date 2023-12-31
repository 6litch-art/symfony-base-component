<?php

namespace Base\Service\Model;

use Base\Database\Walker\CountWalker;
use Base\Database\Walker\GroupByWalker;
use Base\Database\Walker\TranslatableWalker;
use Base\Exception\InvalidPageException;
use Doctrine\ORM\Query;
use Doctrine\ORM\Tools\Pagination\Paginator as DoctrinePaginator;
use Symfony\Component\Routing\RouterInterface;
use Countable;
use Iterator;
use UnexpectedValueException;

class Pagination implements PaginationInterface, Iterator, Countable
{
    protected $router;
    private $build;

    protected $paginator = null;
    protected $totalCount        = 0;

    protected $route           = null;
    protected array $routeParameters = [];

    protected $page      = 0;
    protected $pageIter  = 0;
    protected $pageSize  = 0;
    protected $pageRange = 0;

    protected $template = "@Base/paginator/sliding.html.twig";
    protected $parameterName;

    public function __construct(array|Query $arrayOrQuery, RouterInterface $router, ?string $parameterName = "page")
    {
        if ($arrayOrQuery instanceof Query) {
            $query = $this->clone($arrayOrQuery, false);
            $query->setHint(Query::HINT_CUSTOM_TREE_WALKERS, [GroupByWalker::class]);
            $query->setHint(GroupByWalker::HINT_GROUP_ARRAY, ["id"]);
            $query->setHint(Query::HINT_CUSTOM_OUTPUT_WALKER, TranslatableWalker::class);
            $this->paginator     = new DoctrinePaginator($query);
            $this->totalCount    = $this->getCountQuery($arrayOrQuery, false)->getSingleScalarResult();
        } else {
            $this->paginator     = $arrayOrQuery;
            $this->totalCount    = count_leaves($this->paginator);
        }

        $this->parameterName = $parameterName;
        $this->build = true;
        $this->router = $router;
    }

    public function getCountQuery(Query $query, bool $bHint = true): Query
    {
        $clone = $this->clone($query, $bHint);

        $clone->setCacheable(false);
        $clone->setHint(Query::HINT_CUSTOM_TREE_WALKERS, [CountWalker::class]);
        $clone->setHint(Query::HINT_CUSTOM_OUTPUT_WALKER, TranslatableWalker::class);
        $clone->setFirstResult(null)->setMaxResults(null);

        return $clone;
    }

    protected static function clone(Query $query, bool $bHint = true): Query
    {
        /* @var $countQuery Query */
        $clone = clone $query;

        foreach ($query->getParameters() as $parameter) {
            $clone->setParameter($parameter->getName(), $parameter->getValue());
        }

        if (!$bHint) {
            return $clone;
        }

        foreach ($query->getHints() as $hint => $class) {
            $clone->setHint($hint, $class);
        }

        return $clone;
    }

    public function rewind(): void
    {
        $this->pageIter = 0;
    }
    public function next(): void
    {
        $this->pageIter++;
    }

    public function count(): int
    {
        return $this->pageSize > 0 ? ($this->totalCount % $this->pageSize) + 1 : 0;
    }
    public function key(): mixed
    {
        return ($this->page-1) * $this->pageSize + $this->pageIter ;
    }
    public function valid(): bool
    {
        return $this->isQuery() ? $this->getTotalPages() >= $this->getPage() && $this->pageIter < count($this->getResult()) : $this->pageIter == 0;
    }
    public function current(): mixed
    {
        return $this->isQuery() ? $this->getResult()[$this->pageIter] ?? null : $this->getResult();
    }
    public function getBookmark(): mixed
    {
        return $this->pageIter % $this->getPageSize();
    }

    public function get()
    {
        return $this->paginator;
    }
    public function getQuery(): ?Query
    {
        return $this->isQuery() ? $this->paginator->getQuery()->setFirstResult($this->pageSize * ($this->page-1))->setMaxResults($this->pageSize) : null;
    }
    public function isQuery()
    {
        return $this->paginator instanceof DoctrinePaginator;
    }

    public function getTotalCount()
    {
        return $this->totalCount;
    }
    public function getLastPage()
    {
        return $this->getTotalPages();
    }
    public function getTotalPages()
    {
        $pageSize = $this->getPageSize();
        if (!$pageSize) {
            throw new UnexpectedValueException("No page size defined");
        }

        if ($this->getTotalCount() <= $pageSize) {
            return 1;
        }
        return ceil(max(1, $this->getTotalCount()/$pageSize));
    }

    public function getTemplate()
    {
        return $this->template;
    }
    public function setTemplate(string $template)
    {
        $this->template = $template;
        return $this;
    }

    public function setParameterName($parameterName)
    {
        $this->parameterName = $parameterName;
        return $this;
    }

    public function getParameterName()
    {
        return $this->parameterName;
    }

    public function getPageRange()
    {
        return $this->pageRange;
    }
    public function setPageRange(int $pageRange)
    {
        $this->pageRange = $pageRange;
        return $this;
    }

    public function getPageSize()
    {
        return $this->pageSize;
    }
    public function setPageSize($pageSize)
    {
        $pageSize = ($pageSize < 1 ? $this->getTotalCount() : $pageSize);
        if ($this->pageSize != $pageSize) {
            $this->pageSize = $pageSize;
            $this->build = true;
        }

        return $this;
    }

    public function getPage()
    {
        return $this->page;
    }
    public function setPage($page)
    {
        $page = min(max(1, $page), $this->getTotalPages());

        if ($this->page != $page) {
            $this->page = $page;
            $this->build = true;
        }
        return $this;
    }

    public function getPath(string $name, int $page = 0, array $parameters = [])
    {
        if ($page < 1) {
            $page = $this->getPage();
        }

        return $this->router->generate($name, array_merge($parameters, [$this->getParameterName() => $page]));
    }

    protected array $lastResult = [];
    public function getResult()
    {
        return $this->build();
    }

    protected function build()
    {
        if (!$this->build) {
            return $this->lastResult;
        }
        $this->build = false;

        if ($this->page < 1) {
            return ($this->lastResult = []);
        }
        if ($this->page > $this->getTotalPages()) {
            throw new InvalidPageException("Page not found.");
        }

        if ($this->isQuery()) {
            return $this->lastResult = $this->getQuery()->getResult();
        }

        return $this->lastResult =  array_slice_recursive($this->get(), $this->pageSize * ($this->page-1), $this->pageSize, true /*Always preserve keys*/);
    }
}
