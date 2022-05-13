<?php

namespace Base\Service;

use Hashids\Hashids;

class Obfuscator implements ObfuscatorInterface
{
    protected $hashids;
    public function __construct(ParameterBagInterface $parameterBag)
    {
        $this->hashids = new Hashids($parameterBag->get("kernel.secret"));
    }

    public function encode(mixed $value): string { return $this->hashids->encodeHex(bin2hex(serialize($value))); }
    public function decode(string $hash): mixed  { return unserialize(hex2bin($this->hashids->decodeHex($hash))); }
}
