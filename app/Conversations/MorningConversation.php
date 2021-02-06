<?php

namespace App\Conversations;
use BotMan\BotMan\Messages\Conversations\Conversation;
use BotMan\BotMan\Messages\Incoming\Answer;

/**
 * Created by PhpStorm.
 * User: raphael
 * Date: 02/09/2017
 * Time: 16:27
 */

class MorningConversation extends Conversation
{
    protected $goal_title;

    protected $project_title;

    protected $user;


    public function askGoal()
    {
        $this->ask('Hello! What is your new Goal', function(Answer $answer) {
            // Save result
            $this->goal_title = $answer->getText();

            $this->say('Nice idea ! ');
            $this->askProject();
        });
    }

    public function askProject()
    {
        $question = "Which project ? \r\n" . $this->projectList();

        $this->ask($question, function(Answer $answer) {
            // Save result
            $this->project_title = $answer->getText();

            if ($this->addGoal()){
                $this->say('Great - goal added !');
            } else {
                $this->askProject();
            }

        });
    }

    public function projectList(){
        return  implode("\r\n", $this->user->projects()->pluck('title')->toArray());
    }

    public function addGoal(){
        $project = $this->user->projects()->where('title', $this->project_title)->first();
        if ($project != null){
            $project->goals()->create([
                'title' => $this->goal_title,
                'score' => 1,
                'user_id' => $this->user->id
            ]);
            return true;
        }
        return false;
    }



    /**
     * @return mixed
     */
    public function run()
    {
        $this->user = \'App\Models\User'::first();
        $this->askGoal();
    }
}