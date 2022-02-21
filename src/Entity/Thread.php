<?php

namespace Base\Entity;

use App\Entity\User;
use App\Entity\Thread\Tag;
use App\Entity\Thread\Like;
use App\Entity\Thread\Mention;
use Base\Database\Annotation\OrderColumn;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

use Base\Validator\Constraints as AssertBase;

use Base\Database\Annotation\DiscriminatorEntry;
use Base\Annotations\Annotation\GenerateUuid;
use Base\Annotations\Annotation\Timestamp;
use Base\Annotations\Annotation\Slugify;
use Base\Annotations\Annotation\Hierarchify;
use Base\Enum\ThreadState;

use Base\Traits\BaseTrait;
use Base\Database\TranslatableInterface;
use Base\Database\Traits\TranslatableTrait;
use Base\Model\IconizeInterface;
use Doctrine\ORM\Mapping as ORM;
use Base\Repository\ThreadRepository;

/**
 * @ORM\Entity(repositoryClass=ThreadRepository::class)
 * @ORM\InheritanceType( "JOINED" )
 * 
 * @ORM\DiscriminatorColumn( name = "class", type = "string" )
 *     @DiscriminatorEntry( value = "abstract" )
 *
 * @AssertBase\UniqueEntity(fields={"slug"}, groups={"new", "edit"})
 * @Hierarchify(null, separator = "/" )
 */

class Thread implements TranslatableInterface, IconizeInterface
{
    use BaseTrait;
    use TranslatableTrait;

    public        function __iconize()       : ?array { return $this->getPrimaryTag() && $this->getPrimaryTag()->getIcon() ? [$this->getPrimaryTag()->getIcon()] : null; }
    public static function __iconizeStatic() : ?array { return ["fas fa-box"]; } 

    public function __toString() { return $this->getTitle() ?? $this->getSlug() ?? get_class($this); }
    public function __construct(?User $owner = null, ?Thread $parent = null, ?string $title = null, ?string $slug = null)
    {
        $this->tags = new ArrayCollection();
        $this->children = new ArrayCollection();
        $this->followers = new ArrayCollection();
        $this->mentions = new ArrayCollection();
        $this->likes = new ArrayCollection();
        $this->owners = new ArrayCollection();

        $this->setParent($parent);
        $this->addOwner($owner);
        $this->setTitle($title);

        $this->slug = $slug;

        $this->setState(ThreadState::DRAFT);
    }

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    protected $id;
    public function getId(): ?int { return $this->id; }

    /**
     *
     * @ORM\Column(type="string", unique=true)
     * @GenerateUuid(version=4)
     */
    protected $uuid;
    public function getUuid() { return $this->uuid; }

    /**
     * @ORM\ManyToOne(targetEntity=Thread::class, inversedBy="children")
     * @ORM\JoinColumn(onDelete="SET NULL")
     */
    protected $parent;
    public function getParent(): ?self { return $this->parent; }
    public function setParent(?self $parent): self
    {
        $this->parent = $parent;
        if ($this->parent === null) return $this;

        $this->parent->addChild($this);
        return $this;
    }

    /**
     * @ORM\OneToMany(targetEntity=Thread::class, mappedBy="parent", cascade={"persist"}))
     */
    protected $children;
    public function getChildren(): Collection { return $this->children; }
    public function addChild(self $child): self
    {
        if (!$this->children->contains($child)) {
            $this->children[] = $child;
            $child->setParent($this);
        }

        return $this;
    }

    public function removeChild(self $child): self
    {
        if ($this->children->removeElement($child)) {
            // set the owning side to null (unless already changed)
            if ($child->getParent() === $this) {
                $child->setParent(null);
            }
        }

        return $this;
    }

    /**
     * @ORM\Column(type="string", length=255, unique=true, nullable=true)
     * @Slugify(reference="translations.title")
     */
    protected $slug;
    public function getSlug(): ?string { return $this->slug; }
    public function setSlug(string $slug): self
    {
        $this->slug = $slug;
        return $this;
    }

    /**
     * @ORM\Column(type="thread_state")
     * 
     * @AssertBase\NotBlank(groups={"new", "edit"})
     */
    protected $state;
    public function getState() { return $this->state; }
    public function setState($state): self
    {
        $this->state = $state;
        if ($this->isPublished() && !$this->getPublishedAt())
            $this->setPublishedAt(new \DateTime("now"));

        return $this;
    }

    public function isScheduled(): bool { return $this->publishedAt && !$this->isPublished(); }
    public function isPublished(): bool { return str_starts_with($this->state, ThreadState::PUBLISH); }
    public function isPublishable(): bool
    {
        if($this->state == ThreadState::FUTURE && !$this->publishedAt) return false;
        return time() - $this->publishedAt->getTimestamp() >= 0;
    }

    /**
     * @ORM\ManyToMany(targetEntity=User::class, inversedBy="threads")
     * @AssertBase\NotBlank(groups={"new", "edit"})
     * @OrderColumn()
     */
    protected $owners;
    public function getOwner(): ?User { return $this->owners[0] ?? null; }
    public function getOwners(): Collection { return $this->owners; }
    public function addOwner(?User $owner): self
    {
        if(!$owner) return $this;

        if (!$this->owners->contains($owner)) {
            $this->owners[] = $owner;
        }

        return $this;
    }

    public function removeOwner(?User $owner): self
    {
        $this->owners->removeElement($owner);

        return $this;
    }

    /**
     * @ORM\ManyToMany(targetEntity=User::class, inversedBy="followedThreads")
     */
    protected $followers;
    public function getFollowers(): Collection { return $this->followers; }
    public function addFollower(User $follower): self
    {
        if (!$this->followers->contains($follower)) {
            $this->followers[] = $follower;
        }

        return $this;
    }

    public function removeFollower(User $follower): self
    {
        $this->followers->removeElement($follower);
        return $this;
    }

    /**
     * @ORM\ManyToMany(targetEntity=Tag::class, inversedBy="threads", cascade={"persist", "remove"})
     */
    protected $tags;
    public function getPrimaryTag() { $first = $this->tags->first(); return ($first ? $first : null); }
    public function getSecondaryTags(): array { return $this->tags->slice(1); }
    public function getTags(): Collection { return $this->tags; }
    public function addTag(Tag $tag): self
    {
        if (!$this->tags->contains($tag))
            $this->tags[] = $tag;

        return $this;
    }

    public function removeTag(?Tag $tag): self
    {
        $this->tags->removeElement($tag);

        return $this;
    }

    /**
     * @ORM\OneToMany(targetEntity=Mention::class, mappedBy="thread", orphanRemoval=true, cascade={"persist", "remove"})
     */
    protected $mentions;
    public function getMentions(): Collection { return $this->mentions; }
    public function addMention(Mention $mention): self
    {
        if (!$this->mentions->contains($mention)) {
            $this->mentions[] = $mention;
            $mention->setThread($this);
        }

        return $this;
    }

    public function removeMention(Mention $mention): self
    {
        if ($this->mentions->removeElement($mention)) {
            // set the owning side to null (unless already changed)
            if ($mention->getThread() === $this) {
                $mention->setThread(null);
            }
        }

        return $this;
    }

    /**
     * @ORM\OneToMany(targetEntity=Like::class, mappedBy="thread", orphanRemoval=true, cascade={"persist", "remove"})
     */
    protected $likes;
    public function getLikes(): Collection { return $this->likes; }
    public function addLike(Like $like): self
    {
        // Check if user already likes
        $user = $like->getUser();
        foreach($user->getLikes() as $_like) {

            if ($_like->getThread() != $this) continue;
            return $this;
        }

        // Attach new like !
        if (!$this->likes->contains($like)) {
            $this->likes[] = $like;
            $like->setThread($this);
        }
        return $this;
    }

    public function removeLike(?Like $like): self
    {
        $this->likes->removeElement($like);
        return $this;
    }

    public function isLiked(?User $user, ?string $icon = null /* Icon type: thumbs up, thumbs down,.. */): bool
    {
        if($user == null) return false;

        foreach($this->likes as $like) {

            if ($like->getUser() != $user) continue;
            if ($icon && $like->getIcon() != $icon) continue;
            return true;
        }

        return false;
    }

    /**
     * @ORM\Column(type="datetime")
     * @Timestamp(on="create")
     */
    protected $createdAt;
    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
    
    /**
     * @ORM\Column(type="datetime")
     * @Timestamp(on={"update", "create"})
     */
    protected $updatedAt;
    public function getUpdatedAt(): ?\DateTimeInterface { return $this->updatedAt; }

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $publishedAt;
    public function getPublishedAt(): ?\DateTimeInterface { return $this->publishedAt; }
    public function setPublishedAt(?\DateTimeInterface $publishedAt): self
    {
        $this->publishedAt = $publishedAt;
        return $this;
    }
}