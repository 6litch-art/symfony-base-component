<?php

namespace Base\Entity\User;

use App\Entity\User;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

use App\Repository\User\TokenRepository;
use Doctrine\ORM\Mapping as ORM;
use Hashids\Hashids;

/**
 * @ORM\Entity(repositoryClass=TokenRepository::class)
 */
class Token
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $value;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="tokens")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime")
     */
    private $expireAt;

    public function __construct(string $name = "", string $dt = "")
    {
        $this->hashIds = new Hashids();

        $this->setName($name);
        $this->generate($dt);
    }

    public function __toString()
    {
        return $this->name .
            " " . $this->get() .
            " " . $this->createdAt->getTimestamp() .
            " " . $this->getLifetime();
    }

    public function encode()
    {
        $hex = bin2hex($this->__toString());
        return $this->hashIds->encodeHex($hex);
    }

    public function decode(string $hash)
    {
        $hex = $this->hashIds->decodeHex($hash);
        $str = hex2bin($hex);

        list($name, $value, $timestamp, $dt) = explode(" ", $str);
        $this->setName($name);
        $this->value = $value;

        $createdAt = new \DateTime();
        $createdAt->setTimestamp($timestamp);
        $this->setCreatedAt($createdAt);

        $expireAt = $this->getCreatedAt();
        if (is_numeric($dt)) $dt = "+ " . floor($dt) . " seconds";

        if (!empty($dt)) $expireAt->modify($dt);
        $this->setExpiry($expireAt);
        return $this;
    }

    public function get(): ?string
    {
        return $this->value;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function check($value)
    {
        return (!$this->isHit() && $this->get() == $value);
    }

    public function generate($dt = "")
    {
        // Generate token value
        $this->value = rtrim(str_replace(["+","/"], ["",""], base64_encode(random_bytes(16))), '=');

        // Creation date
        $now = new \DateTime("now");
        $this->setCreatedAt($now);

        // Expiry date calculation
        $expiry = new \DateTime("now");
        if(is_numeric($dt)) $dt = "+ ".floor($dt)." seconds";

        if(!empty($dt)) $expiry->modify($dt);
        $this->setExpiry($expiry);

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getExpireAt(): ?\DateTimeInterface
    {
        return $this->expireAt;
    }

    public function setExpireAt(\DateTimeInterface $expireAt): self
    {
        if (!$this->getCreatedAt())
            $this->setCreatedAt(new \DateTime("now"));

        if ($expireAt < $this->getCreatedAt())
            $expireAt = $this->createdAt;

        $this->expireAt = $expireAt;
        return $this;
    }

    public function getExpiry(): ?\DateTimeInterface
    {
        return $this->getExpireAt();
    }

    public function setExpiry(\DateTimeInterface $expireAt): self
    {
        return $this->setExpireAt($expireAt);
    }

    public function isValid()
    {
        return !$this->isHit();
    }

    public function isHit()
    {
        return (new \DateTime("now") >= $this->getExpiry());
    }

    public function getElapsedTime()
    {
        return time() - $this->createdAt->getTimestamp();
    }

    public function getLifetime()
    {
        return $this->expireAt->getTimestamp() - $this->createdAt->getTimestamp();
    }

    public function getRemainingTime()
    {
        return $this->expireAt->getTimestamp() - time();
    }
}
