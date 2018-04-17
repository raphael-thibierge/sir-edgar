<?php

namespace Tests\Unit;

use App\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserIsAdminTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUserIsAdmin()
    {
        $user = factory(User::class)->states('admin')->create();

        $this->assertTrue($user->isAdmin());
        $this->assertTrue($user->admin);
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUserIsNotAdmin()
    {
        $user = factory(User::class)->create();

        $this->assertFalse($user->isAdmin());
        $this->assertFalse($user->admin);
    }
}
