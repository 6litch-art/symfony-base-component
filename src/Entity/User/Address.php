<?php

namespace Base\Entity\User;

use Base\Database\Annotation\DiscriminatorEntry;
use Base\Model\IconizeInterface;
use Doctrine\ORM\Mapping as ORM;
use Base\Repository\User\AddressRepository;

/**
 * @ORM\Entity(repositoryClass=AddressRepository::class)
 * @ORM\InheritanceType( "JOINED" )
 * @ORM\DiscriminatorColumn( name = "class", type = "string" )
 *     @DiscriminatorEntry
*/

class Address implements IconizeInterface
{
    public        function __iconize(): ?array { return null; }
    public static function __iconizeStatic(): ?array { return ["fas fa-address-card"]; }

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    protected $id;
    public function getId() { return $this->id; }

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $name;
    public function getName(): ?string { return $this->name; }
    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $streetAddress;

    public function getStreetAddress(): ?string { return $this->streetAddress; }
    public function setStreetAddress(?string $streetAddress): self
    {
        $this->streetAddress = $streetAddress;
        return $this;
    }
    
    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $affix;
    public function getAffix(): ?string { return $this->affix; }
    public function setAffix(?string $affix): self
    {
        $this->affix = $affix;

        return $this;
    }

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $zipCode;
    public function getZipCode(): ?string { return $this->zipCode; }
    public function setZipCode(?string $zipCode): self
    {
        $this->zipCode = $zipCode;
        return $this;
    }
    
    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $city;
    public function getCity(): ?string { return $this->city; }
    public function setCity(string $city): self
    {
        $this->city = $city;
        return $this;
    }

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $state;

    public function getState(): ?string { return $this->state; }
    public function setState(string $state): self
    {
        $this->state = $state;
        return $this;
    }

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $country;

    public function getCountry(): ?string { return $this->country; }
    public function setCountry(string $country): self
    {
        $this->country = $country;
        return $this;
    }

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $additional;
    public function getAdditional(): ?string { return $this->additional; }
    public function setAdditional(?string $additional): self
    {
        $this->additional = $additional;

        return $this;
    }
}