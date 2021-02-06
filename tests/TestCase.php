<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Artisan;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected static $migrationsRun = false;

    public function setUp(): void
    {
        parent::setUp(); // TODO: Change the autogenerated stub

        if (!static::$migrationsRun) {
            //Artisan::call('migrate:reset');
            //static::$migrationsRun = true;
        }
    }
}
