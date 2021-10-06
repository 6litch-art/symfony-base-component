<?php

namespace Base\Entity\Thread;

use App\Entity\Thread;

use Base\Repository\Thread\TagRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

use Base\Annotations\Annotation\Slugify;
use Doctrine\ORM\Mapping as ORM;
use Base\Annotations\Annotation\DiscriminatorEntry;
use Base\Database\Traits\TranslatableTrait;
use Base\Database\TranslatableInterface;
use Base\Traits\ColumnAliasTrait;

/**
 * @ORM\Entity(repositoryClass=TagRepository::class)
 * @ORM\InheritanceType( "JOINED" )
 * @ORM\DiscriminatorColumn( name = "class", type = "string" )
 *     @DiscriminatorEntry( value = "abstract" )
 */
class Tag implements TranslatableInterface
{
    use TranslatableTrait;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    protected $id;

    /**
     * @ORM\Column(length=255, unique=true)
     * @Slugify(reference="name")
     */
    protected $slug;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    protected $icon;

    /**
     * @ORM\Column(type="string", length=9, nullable=true)
     */
    protected $color;

    /**
     * @ORM\ManyToMany(targetEntity=Thread::class, mappedBy="tags")
     */
    protected $threads;

    public function __construct(string $name = null, ?string $slug = null)
    {
        $this->threads = new ArrayCollection();
        $this->name = $name;
        $this->slug = $slug;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function __toString()
    {
        return $this->name;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    /**
     * @return Collection|Thread[]
     */
    public function getThreads(): Collection
    {
        return $this->threads;
    }

    public function addThread(Thread $thread): self
    {
        if (!$this->threads->contains($thread)) {
            $this->threads[] = $thread;
            $thread->addTag($this);
        }

        return $this;
    }

    public function removeThread(Thread $thread): self
    {
        if ($this->threads->removeElement($thread)) {
            $thread->removeTag($this);
        }

        return $this;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(?string $color): self
    {
        $this->color = $color;

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
