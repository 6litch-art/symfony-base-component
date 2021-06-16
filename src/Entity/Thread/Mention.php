<?php

namespace Base\Entity\Thread;

use App\Entity\User;
use App\Entity\Thread;

use Base\Repository\MentionRepository;
use Doctrine\ORM\Mapping as ORM;
use Base\Database\Annotation\DiscriminatorEntry;

/**
 * @ORM\Entity(repositoryClass=MentionRepository::class)
 * @ORM\InheritanceType( "JOINED" )
 * @ORM\DiscriminatorColumn( name = "class", type = "string" )
 *     @DiscriminatorEntry( value = "abstract" )
 */
class Mention
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="authoredMentions")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $author;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="mentions")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $target;

    /**
     * @ORM\ManyToOne(targetEntity=Thread::class, inversedBy="mentions")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $thread;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTarget(): ?User
    {
        return $this->target;
    }

    public function setTarget(?User $target): self
    {
        $this->target = $target;

        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): self
    {
        $this->author = $author;

        return $this;
    }

    public function getThread(): ?Thread
    {
        return $this->thread;
    }

    public function setThread(?Thread $thread): self
    {
        $this->thread = $thread;

        return $this;
    }
}
