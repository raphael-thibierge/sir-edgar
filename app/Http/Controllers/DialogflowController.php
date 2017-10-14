<?php

namespace App\Http\Controllers;

use App\Events\PusherDebugEvent;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class DialogflowController extends Controller
{

    /**
     * @var Request
     */
    private $request;

    /**
     * @var User
     */
    private $userInDB;



    private function getAction(){
        return $this->request->get('result')['action'];
    }

    private function getFacebookSenderId(){
        return $this->request->get('originalRequest')['data']['sender']['id'];
    }

    private function getOriginalRequestProvider(){
        return $this->request->get('originalRequest')['source'];
    }

    private function getUserFromFacebook(){
        $this->userInDB = User::where('facebook_sending_id', $this->getFacebookSenderId())->first();
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

    private function findParameter($parameter){
        return $this->request->get('result')['parameters'][$parameter];
    }


    private function findProject(){
        $projectName = $this->findParameter('project');

        $project = $this->userInDB->projects()->where('title', $projectName)->first();

        event(new PusherDebugEvent([
            'project' => $project,
            'projectName' => $projectName
        ]));

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
        $senderId = $this->getFacebookSenderId();

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
     * Dialogflow webhook handler
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


        $this->getUserFromFacebook();

        $action = $this->getAction();

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


            default:
                $responseData = $this->buildSimpleTextResponseData('action not understood');
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

        $title = $this->findParameter('goal');
        $score = $this->findParameter('score');

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
        $goals->each(function ($goal, $key) use(&$goalList)
        {
            $goalList []= "- $goal->title ($goal->score)";
        });

        return $this->buildSimpleTextResponseData(
            (!empty($goalList) ? implode("\r\n", $goalList): "No goal found"));
    }

    public function projectListAsString($projects){
        $projects->each(function ($project, $key) use(&$goalList)
        {
            $goalList []= "- $project->title (" . $project->goals()->whereNull('completed_at')->count() . ")";
        });

        return $this->buildSimpleTextResponseData(
            (!empty($goalList) ? implode("\r\n", $goalList): "No goal found"));
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
}
