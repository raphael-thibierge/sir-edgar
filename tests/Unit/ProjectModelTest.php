<?php

namespace Tests\Feature;

use App\Goal;
use App\Project;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProjectModelTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUserRelationshipOne()
    {
        $user = factory(User::class)->create();

        $project = $user->projects()->create(
            factory(Project::class)->make()->toArray()
        );

        $this->assertEquals($user->id, $project->user_id);
        $this->assertEquals($user->id, $project->user->id);
        $this->assertEquals($user->projects()->first()->id, $project->id);

    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUserRelationshipTwo()
    {
        $user = factory(User::class)->create();

        $user->projects()->create(
            factory(Project::class)->make()->toArray()
        );
        $user->projects()->create(
            factory(Project::class)->make()->toArray()
        );

        $this->assertCount(2, $user->projects);
    }

    public function testProjectHasManyGoals(){
        $project = factory(Project::class)->create();

        $this->assertCount(0, $project->goals()->get());

        $goal = $project->goals()->create(
            factory(Goal::class)->make()->toArray()
        );
        $this->assertCount(1, $project->goals()->get());
        $this->assertEquals($goal->id, $project->goals()->first()->id);

        $project->goals()->create(
            factory(Goal::class)->make()->toArray()
        );
        $this->assertCount(2, $project->goals()->get());
    }
}
