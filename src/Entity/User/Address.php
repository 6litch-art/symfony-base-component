<?php

namespace Base\Entity\User;

use Base\Entity\User;
use Base\Database\Annotation\DiscriminatorEntry;
use Base\Service\Model\IconizeInterface;
use Doctrine\ORM\Mapping as ORM;
use Base\Repository\User\AddressRepository;
use Base\Database\Annotation\Cache;

/**
 * @ORM\Entity(repositoryClass=AddressRepository::class)
 * @ORM\InheritanceType( "JOINED" )
 *
 * @Cache(usage="NONSTRICT_READ_WRITE", associations="ALL")
 *
 * @ORM\DiscriminatorColumn( name = "class", type = "string" )
 *     @DiscriminatorEntry
*/

class Address implements IconizeInterface
{
    public function __toString()
    {
        return $this->streetAddress.", ".ucfirst($this->city).", ".$this->country;
    }
    public function __iconize(): ?array
    {
        return null;
    }
    public static function __iconizeStatic(): ?array
    {
        return ["fa-solid fa-address-card"];
    }

    public function __construct(?string $name = null, ?Address $address = null)
    {
        if ($address) {
            object_hydrate($this, $address);
        }

        $this->name = $name;
    }

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    protected $id;
    public function getId()
    {
        return $this->id;
    }

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $name;
    public function getName(): ?string
    {
        return $this->name;
    }
    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }


    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $country;

    public function getCountry(): ?string
    {
        return $this->country;
    }
    public function setCountry(string $country): self
    {
        $this->country = $country;
        return $this;
    }
    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $state;

    public function getState(): ?string
    {
        return $this->state;
    }
    public function setState(?string $state): self
    {
        $this->state = $state;
        return $this;
    }

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $city;
    public function getCity(): ?string
    {
        return $this->city;
    }
    public function setCity(string $city): self
    {
        $this->city = $city;
        return $this;
    }

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $zipCode;
    public function getZipCode(): ?string
    {
        return $this->zipCode;
    }
    public function setZipCode(string $zipCode): self
    {
        $this->zipCode = $zipCode;
        return $this;
    }


    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $streetAddress;

    public function getStreetAddress(): ?string
    {
        return $this->streetAddress;
    }
    public function setStreetAddress(?string $streetAddress): self
    {
        $this->streetAddress = $streetAddress;
        return $this;
    }

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $affix;
    public function getAffix(): ?string
    {
        return $this->affix;
    }
    public function setAffix(?string $affix): self
    {
        $this->affix = $affix;

        return $this;
    }

    /**
     * @ORM\Column(type="string", length=15, nullable=true)
     */
    protected $phone;
    public function getPhone(): ?string
    {
        return $this->phone;
    }
    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;
        return $this;
    }

    /**
     * @ORM\Column(type="string", length=15, nullable=true)
     */
    protected $fax;
    public function getFax(): ?string
    {
        return $this->fax;
    }
    public function setFax(?string $fax): self
    {
        $this->fax = $fax;
        return $this;
    }

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    protected $additional;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="addresses")
     */
    private $user;
    public function getAdditional(): ?string
    {
        return $this->additional;
    }
    public function setAdditional(?string $additional): self
    {
        $this->additional = $additional;

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
}
