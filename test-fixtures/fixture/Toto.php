<?php

namespace Test\Domain;

use Test\Infrastructure\Tata;
use Test\Service\SomeInterface;

class Toto implements SomeInterface
{
    public function testToto(string $name): void
    {
        sprintf('Hello %s', $name);
    }

    public function anotherTest(string $name): void
    {
        echo $name;
        sprintf('Hello %s', $name);
    }

    public function someService(string $someString): void
    {
        // mandatory method from interface
        $tata = new Tata($someString);
        $tata->getSomeProperty();
        $tata->setSomeProperty($someString);
    }
}
