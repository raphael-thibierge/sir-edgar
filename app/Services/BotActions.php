<?php
/**
 * Created by PhpStorm.
 * User: raphael
 * Date: 15/10/2017
 * Time: 02:36
 */

namespace App\Services;

use App\BotMessage;
use App\Events\PusherDebugEvent;
use App\Exceptions\GoalNameNotFound;
use App\Exceptions\ProjectNameNotFound;
use App\FinancialTransaction;
use App\Goal;
use Carbon\Carbon;

/**
 * Class BotActions
 * @package App\Services
 */
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
        $goalScore = (int)$botMessage->getParameter('score');
        $goalType = $botMessage->getParameter('type');

        // prevent null type
        if ($goalType === null){
            $goalType = Goal::TYPE_DEFAULT;
            $goalTitle = $botMessage->getParameter('goal');
            $project = self::searchProjectsByNameFromMessage($botMessage)->first();
        } else {
            $projectTitle = $goalType . 's';
            $goalTitle = $botMessage->getParameter('title');

            // find or create project of this type of goal
            $project = $botMessage->user->projects()->where('title', $projectTitle)->first();
            if ($project === null){
                $project = $botMessage->user->projects()->create([
                    'title' => $projectTitle
                ]);
            }
        }

        $goalParameters = [
            'user_id'   => $botMessage->user->id,
            'title'     => $goalTitle,
            'score'     => $goalScore,
            'type'      => $goalType,
        ];

        if (($due_date = $botMessage->getParameter(('due_date'))) !== null){
            $goalParameters['due_date'] = new Carbon($due_date, $botMessage->user->timezone);
        }

        if (($time = $botMessage->getParameter(('time'))) !== null){

            if (!isset($goalParameters['due_date'])){
                $goalParameters['due_date'] = Carbon::today($botMessage->user->timezone);
            }

            $goalParameters['due_date'] = $goalParameters['due_date']->setTimeFromTimeString($time);
        }



        if (($notes = $botMessage->getParameter(('notes'))) !== null){
            $goalParameters['notes'] = $notes;
        }


        // create goal
        $goal = $project->goals()->create($goalParameters);

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
        $goals = $botMessage->user->goals()
            ->whereNull('completed_at')
            ->where('today', true)->get();
        BotResponse::display_goal_list_response($goals, $botMessage);
    }

    /**
     * @param BotMessage $botMessage
     * @throws GoalNameNotFound
     */
    public static function complete_goal_action(BotMessage &$botMessage)
    {
        $goal = self::searchGoalsByNameFromMessage($botMessage)->first();

        $goal->setCompletedAndSave();

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
        $goals = $project->goals()->whereNull('completed_at')->get();
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
        try {
            self::searchProjectsByNameFromMessage($botMessage);
            $botMessage->buildTextResponse("You already have a project with this name");
            return;

        } catch (ProjectNameNotFound $exception){

        }

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

    public static function expense_create_action(BotMessage &$botMessage)
    {
        $expense = $botMessage->getParameter('expense');
        $unitCurrency = $botMessage->getParameter('unit-currency');


        $expense = new FinancialTransaction([
            'title'     => $expense,
            'currency'  => strtoupper($unitCurrency['currency']),
            'price'     => (float)$unitCurrency['amount'],
            'type'      => FinancialTransaction::EXPENSE
        ]);
        $expense->tagsEdit();

        $expense = $botMessage->user->financialTransactions()->save($expense);

        BotResponse::display_expense_response($expense, $botMessage);
    }

    public static function expense_total_action(BotMessage &$botMessage)
    {
        if (($datePeriod = $botMessage->getParameter('date-period')) !== null){
            $datePeriod = explode('/', $datePeriod);
            $startDate = (new Carbon($datePeriod[0], $botMessage->user->timezone))->startOfDay();
            $stopDate = (new Carbon($datePeriod[1], $botMessage->user->timezone))->startOfDay()->addDay(1);
        } else if (($date = $botMessage->getParameter('date')) !== null){
            $startDate = (new Carbon($date, $botMessage->user->timezone))->startOfDay();
            $stopDate = (new Carbon($startDate, $botMessage->user->timezone))->startOfDay()->addDay(1);
        } else {
            $startDate = new Carbon('1970/01/01');
            $stopDate = Carbon::tomorrow($botMessage->user->timezone);
        }

        $stopDate->addDay(1);

        $total = $botMessage->user->financialTransactions()
            ->where('type', FinancialTransaction::EXPENSE)
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<', $stopDate)
            ->sum('price');

        $botMessage->buildTextResponse("You spent $total of your usual devise");
    }
}