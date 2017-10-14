<?php

namespace App\Http\Controllers;

use App\DialogflowWebhook;
use App\Events\PusherDebugEvent;
use App\Goal;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class DialogflowController extends Controller
{
    public function __construct()
    {
        $this->middleware('admin', ['only' => 'index', 'show']);
    }



    /**
     * @var Request
     */
    private $request;

    /**
     * @var User
     */
    private $userInDB;

    /**
     * @var DialogflowWebhook
     */
    private $webhook;


    public function index(){
        $webhooks = DialogflowWebhook::orderBy('created_at', 'DESC')->paginate(20);

        return view('dialogflow.index', ['webhooks' => $webhooks]);
    }

    public function show(DialogflowWebhook $webhook){
        dd($webhook->request);
    }



    private function getUserFromFacebook(){
        $this->userInDB = $this->webhook->user;
    }


    private function simpleTextResponse(string $text){
        return response()->json($this->buildSimpleTextResponseData($text));
    }

    private function buildSimpleTextResponseData(string $text){
        return [
            'speech' => $text,
            'displayText' => $text,
        ];
    }

    private function findParameter(string $parameter){
        return $this->webhook->findParameter($parameter);
    }


    private function findProject(){
        $projectName = $this->webhook->findParameter('project');

        $project = $this->userInDB->projects()->where('title', $projectName)->first();

        return $project;
    }


    private function show_project_action(){

        $project = $this->findProject();

        if ($project === null) {
            $responseData = $this->buildSimpleTextResponseData('Project not found');
        } else {


            $goals = $project->goals()->select(['title', 'score', 'completed_at'])
                ->whereNull('completed_at')->get();

            $responseData = $this->goalListAsString($goals);
        }

        return $responseData;
    }

    private function ask_login_action(){
        $senderId = $this->webhook->getSender()['id'];

        if ($this->userInDB !== null){
            return $this->buildSimpleTextResponseData('Your account is already linked.');
        }

        return $this->buildEventResponse('send_login', [
            'url' => route('dialogflow.authorize.messenger.post', [
                'senderId' => $senderId
            ])
        ]);
    }


    /**
     * dialogflow webhook handler
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function dialogflow(Request $request){
        $this->request = $request;
        event(new PusherDebugEvent([
            'method' => 'DialogflowController@dialogflow1',
            'request' => $request->toArray(),
        ]));

        $this->webhook= DialogflowWebhook::createFromRequest($request);

        $this->webhook->save();


        $this->getUserFromFacebook();

        $action = $this->webhook->getAction();

        if ($this->userInDB === null && $action !== 'ask_login_action' && $action !== 'ask_logout_action' ){
            return $this->simpleTextResponse('User not found');
        }

        $responseData = null;
        switch ($action){

            case 'add_goal_action':
                $responseData = $this->add_goal_action();
                break;

            case 'show_project_action':
                $responseData = $this->show_project_action();
                break;

            case 'ask_login_action':
                $responseData = $this->ask_login_action();
                break;

            case 'ask_logout_action':
                $this->getUserFromFacebook();
                if ($this->userInDB !== null){
                    $this->userInDB->update(['facebook_sending_id' => null]);
                    $responseData = $this->buildEventResponse('logout_event');
                } else {
                    $responseData = $this->simpleTextResponse('Your messenger account is not linked');
                }
                break;

            case 'important_goals_action':
                $responseData = $this->important_goals_action();
                break;

            case 'project_list_action':
                $responseData = $this->project_list_action();
                break;

            case 'complete_goal_action':
                $responseData = $this->complete_goal_action();
                break;

            case 'due_today_action':
                $responseData = $this->due_today_action();
                break;

            case 'project_create_action':
                $responseData = $this->project_create_action();
                break;

            case 'current_score_action':
                $responseData = $this->current_score_action();
                break;

            case 'set_score_goal_action':
                $responseData = $this->set_score_goal_action();
                break;

            case 'test_action':
                $responseData = $this->buildSimpleTextResponseData('Test validate ;)');
                break;

            case 'score_progress_action':
                $responseData = $this->score_progress_action();
                break;

            case 'show_daily_score_action':
                $responseData = $this->show_daily_score_action();
                break;

            default:
                break;
        }


        return response()->json($responseData);
    }

    private function buildEventResponse(string $event, array $parameters = []){
        return $parameters === [] ? [
            "followupEvent" => [
                "name" => $event,
            ]
        ] : [
            "followupEvent" => [
                "name" => $event,
                "data" => $parameters
            ]
        ];
    }

    private function add_goal_action()
    {
        $project = $this->findProject();
        if ($project === null){
            return $this->buildSimpleTextResponseData('Project not found');
        }

        $title = $this->webhook->findParameter('goal');
        $score = (int)$this->webhook->findParameter('score');

        $project->goals()->create([
            'user_id'   => $this->userInDB->id,
            'title'     => $title,
            'score'     => $score
        ]);

        return $this->buildEventResponse('goal_added', [
            'title' => $title,
            'score' => $score,
            'project' => $project->title
        ]);

    }

    public function messengerAuthorizePost(Request $request, string $senderId){
        if ($request->has('redirect_uri') && $request->has('account_linking_token')){

            session(['messenger_sender_id' => $senderId]);

            if (($user = Auth::user()) !== null){
                return Redirect::to(route('botman.confirm.show', [
                    'redirect_uri' => $request->get('redirect_uri'),
                    'account_linking_token' => $request->get('account_linking_token'),
                ]));
            }
        }
        return view('auth.login');
    }

    public function showConfirm(){
        return view('auth.messenger-confiramtion');
    }

    public function goalListAsString($goals){
        $goalList = [];
        $goals->each(function (Goal $goal, $key) use(&$goalList)
        {

            event(new PusherDebugEvent([
                'method' => 'DialogflowController@dialogflow1',
                'goal' => $goal->toArray(),
            ]));

            $goalList []= "- $goal->title ($goal->score)";
        });

        return $this->buildSimpleTextResponseData(
            (!empty($goalList) ? implode("\r\n", $goalList): "No goal found"));
    }

    public function projectListAsString($projects){
        $projectList = [];
        $projects->each(function ($project, $key) use(&$projectList)
        {
            $projectList []= "- $project->title (" . $project->goals()->whereNull('completed_at')->count() . ")";
        });

        return $this->buildSimpleTextResponseData(
            (!empty($projectList) ? implode("\r\n", $projectList): "No project found"));
    }

    private function important_goals_action()
    {
        return $this->goalListAsString($this->userInDB->goals()->where('today', true)->get());
    }

    private function project_list_action()
    {
        $projects = $this->userInDB->projects;
        return $this->projectListAsString($projects);
    }

    private function complete_goal_action()
    {
        $goalTitle = $this->findParameter('goal');

        $goal = $this->userInDB->goals()->where('title', $goalTitle)->first();

        if ($goal !== null){
            $goal->setCompleted();
            $goal->update();
            return $this->buildSimpleTextResponseData('Goal completed !');
        } else {
            return $this->buildSimpleTextResponseData('Goal not found..');
        }
    }

    private function due_today_action()
    {
        $due_date= $this->findParameter('due_date');

        $start = new Carbon($due_date, $this->userInDB->timezone);
        $start->subDay(1);
        $stop = new Carbon($due_date, $this->userInDB->timezone);
        $stop->addDay(1);


        $goals = $this->userInDB->goals()
            ->whereNull('completed_at')
            ->whereNotNull('due_date')
            ->where('due_date', '>=', Carbon::today($this->userInDB->timezone))
            ->where('due_date', '<', Carbon::tomorrow($this->userInDB->timezone))
            ->get();
        event(new PusherDebugEvent([
            'request' => $start,
            'goals' => $goals,
            'carbi' => Carbon::now($this->userInDB->timezone),
        ]));

        return $this->goalListAsString($goals);

    }

    private function project_create_action()
    {
        $project = $this->userInDB->projects()->create([
            'title' => $this->webhook->findParameter('project')
        ]);

        return $this->buildSimpleTextResponseData("Project $project->title created" );
    }

    private function current_score_action()
    {
        $score = $this->webhook->user->getCurrentScore();

        return $this->buildSimpleTextResponseData("Your current score is $score");
    }

    public function set_score_goal_action()
    {
        $score = $this->webhook->findParameter('score');
        $this->webhook->user->setDailyScoreGoal((int) $score);
        $this->webhook->user->update();

        return $this->buildSimpleTextResponseData("Your goal score is now $score");
    }

    private function score_progress_action()
    {
        $progress = $this->webhook->user->currentProgress();
        return $this->buildSimpleTextResponseData("You achieve $progress% !");
    }

    private function show_daily_score_action()
    {
        $score = $this->webhook->user->daily_score_goal;
        return $this->buildSimpleTextResponseData("Your current score intent is $score");
    }


}
