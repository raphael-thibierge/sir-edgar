<?php

namespace Tests\Feature;

use App\Goal;
use App\Project;
use App\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GoalModelTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUserAndProjectRelationship()
    {
        $user = factory(User::class)->create();
        $project = factory(Project::class)->create();
        $goal = $user->goals()->create(
            factory(Goal::class)->make([
                'project_id' => $project->id
            ])->toArray()
        );

        $this->assertEquals($user->id, $goal->user_id);
        $this->assertEquals($user->id, $goal->user->id);
        $this->assertEquals($project->id, $goal->project_id);
        $this->assertEquals($project->id, $goal->project->id);
    }

    public function testSetCompletedAndSave(){
        $user = factory(User::class)->create();
        $project = factory(Project::class)->create();
        $goal = $user->goals()->create(
            factory(Goal::class)->make([
                'project_id' => $project->id
            ])->toArray()
        );

        $this->assertFalse($goal->getIsCompletedAttribute());
        $goal->setCompletedAndSave();
        $this->assertTrue($goal->getIsCompletedAttribute());
        $this->assertNotNull($goal->completed_at);
    }

    public function testGoalToString(){
        $title = 'test';
        $score = 1;
        $goal = factory(Goal::class)->create([
            'title' => $title,
            'score' => $score,
        ]);

        $this->assertEquals("$title ($score)", $goal->toString());
    }

    public function testSearchByTitle(){
        $title = 'my goal random';
        $goal = factory(Goal::class)->create([
            'title' => $title
        ]);

        $this->assertEquals($title, Goal::searchByTitle($title)->first()->title);
    }
}
