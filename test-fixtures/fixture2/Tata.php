<?php

namespace Test\Infrastructure;

use Test\Domain\Toto;

class Tata
{
    private string $someProperty;

    public function __construct(string $someProperty) {
        $this->someProperty = $someProperty;
    }

    public function getSomeProperty(): string
    {
        return $this->someProperty;
    }

    public function setSomeProperty(string $someProperty): self
    {
        $this->someProperty = $someProperty;

        return $this;
    }

    public function testTata(string $name): void
    {
        $toto = new Toto();
        sprintf('Hello %s', $name);
        $toto->testToto($name);
    }

    public function testToto(string $name): void
    {
        echo $name;
    }
}
