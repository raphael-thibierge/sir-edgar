<?php

namespace App\Http\Controllers;

use App\BotMessage;
use App\Events\PusherDebugEvent;
use App\Exceptions\GoalNameNotFound;
use App\Exceptions\ProjectNameNotFound;
use App\Goal;
use App\Services\BotActions;
use App\Services\BotResponse;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class BotController extends Controller
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
     * @var BotMessage
     */
    private $botMessage;


    public function index(){
        $webhooks = BotMessage::orderBy('created_at', 'DESC')->paginate(20);

        return view('dialogflow.index', ['webhooks' => $webhooks]);
    }

    public function show(BotMessage $botMessage){
        dd([
            'request' => $botMessage->request,
            'response' => $botMessage->response,
        ]);
    }


    private function getUserFromFacebook(){
        $this->userInDB = $this->botMessage->user;
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
        return $this->botMessage->getParameter($parameter);
    }


    private function findProject(){

        $projectName = $this->botMessage->getParameter('project');

        $projectNameLowerCase = strtolower($projectName);
        $projectNameFirstUpperCase = ucfirst($projectName);


        $project = $this->botMessage->user->projects()
            ->whereIn('title', [$projectNameLowerCase, $projectNameFirstUpperCase])
            ->first();

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
        $senderId = $this->botMessage->getSender()['id'];

        if ($this->userInDB !== null){
            $this->botMessage->buildTextResponse('Your account is already linked.');
        }

        $this->botMessage->buildEventResponse('send_login', [
            'url' => route('dialogflow.authorize.messenger.post', [
                'senderId' => $senderId
            ])
        ]);
    }


    public function pusherDebug($data){
        event(new PusherDebugEvent($data));
    }

    /**
     * dialogflow webhook handler
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function dialogflow(Request $request){
        $this->botMessage = BotMessage::createFromRequest($request);

        event(new PusherDebugEvent([
            'method' => 'DialogflowController@dialogflow1',
            'request' => $request->toArray(),
        ]));


        $this->request = $request;

        $this->getUserFromFacebook();

        $action = $this->botMessage->getAction();

        if ($this->userInDB === null && $action !== 'ask_login_action' && $action !== 'ask_logout_action' ){
            return $this->simpleTextResponse('User not found');
        }

        $responseData = null;

        try {
            switch ($action) {

                case 'add_goal_action':
                    BotActions::goal_create_action($this->botMessage);
                    break;

                case 'show_project_action':
                    BotActions::project_show_action($this->botMessage);
                    break;

                    // todo
                case 'ask_login_action':
                    $this->ask_login_action();
                    break;
                // todo
                case 'ask_logout_action':
                    $this->getUserFromFacebook();
                    if ($this->userInDB !== null) {
                        $this->userInDB->update(['facebook_sending_id' => null]);
                        $this->botMessage->buildEventResponse('logout_event');
                    } else {
                        $this->botMessage->buildTextResponse('Your messenger account is not linked');
                    }
                    break;


                case 'important_goals_action':
                    BotActions::important_goals_action($this->botMessage);
                    break;

                case 'project_list_action':
                    BotActions::project_list_action($this->botMessage);
                    break;

                case 'complete_goal_action':
                    BotActions::complete_goal_action($this->botMessage);
                    break;

                case 'due_today_action':
                    BotActions::goals_ending_today_action($this->botMessage);
                    break;

                case 'project_create_action':
                    BotActions::project_create_action($this->botMessage);
                    break;

                case 'current_score_action':
                    BotActions::current_score_action($this->botMessage);
                    break;

                case 'set_score_goal_action':
                    BotActions::set_intent_score_action($this->botMessage);
                    break;

                case 'test_action':
                    $this->botMessage->buildTextResponse('Test validate ;)');
                    break;

                case 'score_progress_action':
                    BotActions::get_progress_score_action($this->botMessage);
                    break;

                case 'show_daily_score_action':
                    BotActions::get_intent_score_action($this->botMessage);
                    break;

                case 'find_goal_action':
                    BotActions::goal_find_action($this->botMessage);
                    break;

                case 'financial_transaction_create_action':
                    BotActions::financial_transaction_create_action($this->botMessage);
                    break;

                case 'financial_transaction_expense_total_action':
                    BotActions::financial_transactions_total_action($this->botMessage);
                    break;

                default:
                    BotResponse::fallback_response($this->botMessage);
                    break;
            }
        } catch (ProjectNameNotFound $exception){
            $this->botMessage->buildTextResponse($exception->getNiceMessage()
                . " I think it not exists, check it by asking me your project list or create it :)"
            );
        } catch (GoalNameNotFound $exception){
            $this->botMessage->buildTextResponse($exception->getNiceMessage());
        }

        return response()->json($this->botMessage->response);
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

}
