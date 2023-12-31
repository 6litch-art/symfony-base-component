<?php

namespace Base\Service\Model;

use App\Entity\User;
use Base\Enum\SpamScore;

interface SpamProtectionInterface
{
    public function getSpamBlameable(): ?User;

    public function getSpamText(): ?string;
    public function getSpamDate(): \DateTime;
    public function getSpamCallback(int $score);
}
