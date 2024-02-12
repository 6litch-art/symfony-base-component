<?php

namespace Base\Entity\Layout;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

use Base\Database\TranslationInterface;
use Base\Database\Traits\TranslationTrait;
use Base\Traits\BaseTrait;

#[ORM\Entity]
class ShortIntl implements TranslationInterface
{
    use BaseTrait;
    use TranslationTrait;

    #[ORM\Column(type:"string", length:255, nullable:true)]
    protected $label;

    public function getLabel(): ?string
    {
        return $this->label;
    }

    /**
     * @param string|null $label
     * @return $this
     */
    public function setLabel(?string $label)
    {
        $this->label = $label;
        return $this;
    }

    #[ORM\Column(type:"text")]
    #[Assert\Url]
    protected $url = null;

    public function getUrl(): ?string
    {
        return $this->url;
    }

    /**
     * @param string $url
     * @return $this
     */
    public function setUrl(string $url)
    {
        $this->url = $url;
        return $this;
    }
}
