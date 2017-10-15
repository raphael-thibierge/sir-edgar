<?php
/**
 * Created by PhpStorm.
 * User: raphael
 * Date: 15/10/2017
 * Time: 02:36
 */

namespace App\Services;

use App\BotMessage;
use App\Exceptions\GoalNameNotFound;
use App\Exceptions\ProjectNameNotFound;
use Carbon\Carbon;

class BotActions
{

    /**
     * @param BotMessage $message
     * @throws ProjectNameNotFound
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    private static function searchProjectsByNameFromMessage(BotMessage &$message){
        // get project name to search
        $projectName = $message->getParameter('project');
        // find project
        $projects = $message->user->searchUserProjectsByName($projectName)->get();
        if ($projects->count() === 0){
            throw new ProjectNameNotFound($projectName);
        }
        return $projects;
    }

    /**
     * @param BotMessage $message
     * @throws GoalNameNotFound
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    private static function searchGoalsByNameFromMessage(BotMessage &$message){
        // get project name to search
        $goalName = $message->getParameter('goal');
        // find project
        $goals = $message->user->searchUserGoalsByName($goalName)->get();
        if ($goals->count() === 0){
            throw new GoalNameNotFound($goalName);
        }
        return $goals;
    }


    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *                                                               *
     *                      GOALS ACTIONS                            *
     *                                                               *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    /**
     * Create a goal from bot message
     *
     * @param BotMessage $botMessage
     * @throws ProjectNameNotFound
     */
    public static function goal_create_action(BotMessage &$botMessage)
    {
        // get parameters
        $goalTitle = $botMessage->getParameter('goal');
        $goalScore = (int)$botMessage->getParameter('score');

        // create goal
        $goal = self::searchProjectsByNameFromMessage($botMessage)->first()->goals()->create([
            'user_id'   => $botMessage->user->id,
            'title'     => $goalTitle,
            'score'     => $goalScore
        ]);

        // build response
        BotResponse::display_goal_response($goal, $botMessage);
    }

    /**
     * Find goals from bot message from bot message
     *
     * @param BotMessage $botMessage
     */
    public static function goal_find_action(BotMessage &$botMessage)
    {
        $goals = self::searchGoalsByNameFromMessage($botMessage);

        if ($goals->count() == 1){
            BotResponse::display_goal_response($goals->first(), $botMessage);
        } else {
            BotResponse::display_goal_list_response($goals, $botMessage);
        }
    }

    /**
     * Show goals ending today from bot message
     *
     * @param BotMessage $botMessage
     */
    public static function goals_ending_today_action(BotMessage &$botMessage)
    {
        $goals = $botMessage->user->goalsEndingToday()->get();
        BotResponse::display_goal_list_response($goals, $botMessage);
    }

    /**
     * Show important goals from bot message
     *
     * @param BotMessage $botMessage
     */
    public static function important_goals_action(BotMessage $botMessage)
    {
        $goals = $botMessage->user->goals()->where('today', true)->get();
        BotResponse::display_goal_list_response($goals, $botMessage);
    }

    /**
     * @param BotMessage $botMessage
     * @throws GoalNameNotFound
     */
    public static function complete_goal_action(BotMessage &$botMessage)
    {
        $goal = self::searchGoalsByNameFromMessage($botMessage)->first();

        $goal->setCompleted();
        $goal->update();

        $botMessage->buildTextResponse('Goal completed !');
    }


    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *                                                               *
     *                      PROJECT ACTIONS                          *
     *                                                               *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    /**
     * Show a project content from bot message
     *
     * @param BotMessage $botMessage
     */
    public static function project_show_action(BotMessage &$botMessage){
        // find project
        $project = self::searchProjectsByNameFromMessage($botMessage)->first();
        // get project's content
        $goals = $project->goals()->select(['title', 'score', 'completed_at'])->whereNull('completed_at')->get();
        // build response
        BotResponse::display_goal_list_response($goals, $botMessage);
    }

    /**
     * Show project list from bot message
     *
     * @param BotMessage $botMessage
     */
    public static function project_list_action(BotMessage &$botMessage)
    {
        $projects = $botMessage->user->projects;
        BotResponse::display_project_list_response($projects, $botMessage);
    }

    /**
     * Create a new project from bot message
     *
     * @param BotMessage $botMessage
     */
    public static function project_create_action(BotMessage &$botMessage)
    {
        // get parameter
        $projectTitle = $botMessage->getParameter('project');
        // create project
        $project = $botMessage->user->projects()->create([
            'title' => $projectTitle
        ]);
        // build response
        $botMessage->buildTextResponse("Project \"$project->title\" created" );
    }


    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *                                                               *
     *                      PROJECT ACTIONS                          *
     *                                                               *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    /**
     * Display user's current score from bot message
     *
     * @param BotMessage $botMessage
     */
    public static function current_score_action(BotMessage &$botMessage)
    {
        // get user's current score
        $score = $botMessage->user->getCurrentScore();
        // build response
        $botMessage->buildTextResponse("Your current score is $score");
    }

    /**
     * Get user's score intent from bot message
     *
     * @param BotMessage $botMessage
     * @return mixed
     */
    public static function get_intent_score_action(BotMessage &$botMessage)
    {
        $score = $botMessage->user->daily_score_goal;
        $botMessage->buildTextResponse("Your current score intent is $score");
    }

    /**
     * Set user's score intent from bot message
     *
     * @param BotMessage $botMessage
     */
    public static function set_intent_score_action(BotMessage &$botMessage)
    {
        // get parameter
        $score = $botMessage->getParameter('score');
        // set new score
        $botMessage->user->setDailyScoreGoal((int) $score);
        $botMessage->user->update();
        // build response
        return $botMessage->buildTextResponse("Your score intent is now $score");
    }

    /**
     * Display user's progress score from bot message
     *
     * @param BotMessage $botMessage
     */
    public static function get_progress_score_action(BotMessage &$botMessage)
    {
        $progress = $botMessage->user->currentProgress();
        $botMessage->buildTextResponse("You achieve $progress% !");
    }
}