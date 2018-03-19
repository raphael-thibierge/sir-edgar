<?php

namespace Tests\Feature;

use App\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class HorizonAccessTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUserNotAdminCanNotAccess()
    {
        $user = factory(User::class)->create();

        $response = $this->actingAs($user)->get(route('horizon.stats.index'));

        $response->assertStatus(403);
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUserAdminCanAccess()
    {
        $user = factory(User::class)->states('admin')->create();

        $response = $this->actingAs($user)->get(route('horizon.stats.index'));

        $response->assertStatus(200);
    }
}
