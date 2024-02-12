<?php

namespace Base\Entity\Extension;

use App\Entity\User;
use Base\Database\Annotation\DiscriminatorEntry;
use Base\Entity\Extension\Abstract\AbstractExtension;
use Base\Enum\LogLevel;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Config\Definition\Exception\Exception;

use Doctrine\ORM\Mapping as ORM;
use Base\Repository\Extension\LogRepository;
use Base\Database\Annotation\Cache;
use Throwable;

#[ORM\Entity(repositoryClass: LogRepository::class)]
#[Cache(usage: "NONSTRICT_READ_WRITE", associations: "ALL")]
#[DiscriminatorEntry(value: "log")]
class Log extends AbstractExtension
{
    public static function __iconizeStatic(): ?array
    {
        return ["fa-solid fa-info-circle"];
    }

    public function __construct(array $listener, Request $request = null)
    {
        if (!array_key_exists("event", $listener)) {
            throw new Exception("Array key \"event\" missing in dispatcher entry");
        }
        if (!array_key_exists("priority", $listener)) {
            throw new Exception("Array key \"priority\" missing in dispatcher entry");
        }
        if (!array_key_exists("pretty", $listener)) {
            throw new Exception("Array key \"pretty\" missing in dispatcher entry");
        }

        $this->event = $listener["event"];
        $this->priority = $listener["priority"];
        $this->pretty = $listener["pretty"];
        $this->level = LogLevel::INFO;
        $this->agent = User::getAgent();
        $this->ip = User::getIp();

        if ($request) {
            $this->setRequest($request);
        }
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return __CLASS__ . " #" . $this->getId() . ": " . $this->event . "/" . $this->level . "/" . $this->createdAt;
    }

    public function supports(): bool
    {
        return true;
    }

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "logs")]
    protected $user;
    public function getUser(): ?User { return $this->user; }
    public function setUser(?User $user): self
    {
        $this->user = $user;
        $this->user->addLog($this);

        $this->ip = $this->getUser()->getIp();
        $this->agent = $this->getUser()->getAgent();

        return $this;
    }

    #[ORM\Column(type:"string", length:255)]
    protected $event;

    /**
     * @return mixed
     */
    public function getEvent()
    {
        return $this->event;
    }

    #[ORM\Column(type:"string", length:255)]
    protected $priority;

    /**
     * @return mixed
     */
    public function getPriority()
    {
        return $this->priority;
    }

    #[ORM\Column(type:"text")]
    protected $pretty;

    /**
     * @return mixed
     */
    public function getPretty()
    {
        return $this->pretty;
    }

    #[ORM\Column(type:"string", length:20)]
    protected $ip;

    /**
     * @return string|null
     */
    public function getIp()
    {
        return $this->ip;
    }

    #[ORM\Column(type:"string", length:5, nullable:true)]
    protected $locale;

    /**
     * @return mixed
     */
    public function getLocale()
    {
        return $this->locale;
    }

    #[ORM\Column(type:"string", length:255, nullable:true)]
    protected $method;

    /**
     * @return mixed
     */
    public function getMethod()
    {
        return $this->method;
    }

    #[ORM\Column(type:"text", nullable:true)]
    protected $requestUri;

    /**
     * @return mixed
     */
    public function getRequestUri()
    {
        return $this->requestUri;
    }

    #[ORM\Column(type: "integer")]
    protected $statusCode;

    /**
     * @return mixed
     */
    public function getStatusCode()
    {
        return $this->statusCode;
    }

    #[ORM\Column(type:"text", nullable:true)]
    protected $agent;

    /**
     * @return string|null
     */
    public function getAgent()
    {
        return $this->agent;
    }

    #[ORM\Column(type:"text", nullable:true)]
    protected $extra;

    /**
     * @return mixed
     */
    public function getExtra()
    {
        return $this->extra;
    }

    #[ORM\Column(type: "log_level")]
    protected $level;

    /**
     * @return string
     */
    public function getLevel()
    {
        return $this->level;
    }

    public function setRequest(Request $request)
    {
        $this->statusCode = "302";
        $this->requestUri = $request->getRequestUri() ?? null;
        $this->locale = $request->getLocale() ?? null;
        $this->method = $request->getMethod() ?? null;
    }

    public function setException(?Throwable $exception)
    {
        if (!$exception) {
            return;
        }
        $this->level = LogLevel::CRITICAL;
        $this->statusCode = $exception->getStatusCode();

        $this->extra = "";
        if ($exception instanceof HttpException) {
            $this->extra .= "HTTP " . $exception->getStatusCode() . " ";
        }
        $this->extra .= get_class($exception) . PHP_EOL;
        $this->extra .= PHP_EOL;
        $this->extra .= $exception->getFile() . ":" . $exception->getLine() . PHP_EOL;
        $this->extra .= $exception->getMessage() . PHP_EOL;
        $this->extra .= PHP_EOL;
        $this->extra .= $exception->getTraceAsString();
    }
}
