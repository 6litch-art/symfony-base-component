<?php

namespace Base\Entity\User;

use App\Repository\User\PermissionRepository;

use App\Entity\User;
use App\Entity\User\Group;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=PermissionRepository::class)
 */
class Permission
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
    private $tag;

    /**
     * @ORM\ManyToMany(targetEntity=User::class, mappedBy="permissions")
     */
    private $uid;

    /**
     * @ORM\ManyToMany(targetEntity=Group::class, mappedBy="permissions")
     */
    private $gid;

    /**
     * @ORM\Column(type="json")
     */
    private $empower = [];

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $icon;

    /**
     * @ORM\Column(type="text")
     */
    private $description;

    public function __construct()
    {
        $this->uid = new ArrayCollection();
        $this->gid = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTag(): ?string
    {
        return $this->tag;
    }

    public function setTag(string $tag): self
    {
        $this->tag = $tag;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @see GroupInterface
     */
    public function getEmpoweredRoles(): array
    {
        return array_unique($this->empower);
    }

    public function setEmpoweredRoles(array $empower): self
    {
        $this->empower = $empower;

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getUid(): Collection
    {
        return $this->uid;
    }

    public function addUid(User $uid): self
    {
        if (!$this->uid->contains($uid)) {
            $this->uid[] = $uid;
            $uid->addPermission($this);
        }

        return $this;
    }

    public function removeUid(User $uid): self
    {
        if ($this->uid->removeElement($uid)) {
            $uid->removePermission($this);
        }

        return $this;
    }

    /**
     * @return Collection|Group[]
     */
    public function getGid(): Collection
    {
        return $this->gid;
    }

    public function addGid(Group $gid): self
    {
        if (!$this->gid->contains($gid)) {
            $this->gid[] = $gid;
            $gid->addPermission($this);
        }

        return $this;
    }

    public function removeGid(Group $gid): self
    {
        if ($this->gid->removeElement($gid)) {
            $gid->removePermission($this);
        }

        return $this;
    }

    public function getIcon(): ?string
    {
        return $this->icon;
    }

    public function setIcon(?string $icon): self
    {
        $this->icon = $icon;

        return $this;
    }
}
