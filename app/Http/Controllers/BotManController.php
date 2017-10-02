<?php

namespace App\Http\Controllers;


use App\Events\PusherDebugEvent;
use App\FinancialTransaction;
use App\Goal;
use App\User;
use BotMan\BotMan\BotMan;
use BotMan\BotMan\BotManFactory;
use BotMan\BotMan\Drivers\DriverManager;
use BotMan\Drivers\Facebook\Extensions\ButtonTemplate;
use BotMan\Drivers\Facebook\Extensions\Element;
use BotMan\Drivers\Facebook\Extensions\ElementButton;
use BotMan\Drivers\Facebook\Extensions\GenericTemplate;
use BotMan\Drivers\Facebook\Extensions\ListTemplate;
use BotMan\Drivers\Facebook\FacebookDriver;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Pusher;

class BotManController extends Controller
{

    public function handle(Request $request)
    {

        event(new PusherDebugEvent([
            'method' => 'BotManController@handle',
            'request' => $request->toArray(),
        ]));

        DriverManager::loadDriver(FacebookDriver::class);

        // Create BotMan instance
        $config = [
            'facebook' => [
                'token' => env('FACEBOOK_TOKEN'),
                'app_secret' => env('FACEBOOK_APP_SECRET'),
                'verification' => env('FACEBOOK_VERIFICATION'),
            ]
        ];

        $botman = BotManFactory::create($config);




        $message = $request->only(['entry'])['entry'][0]['messaging'][0];

        if (isset($message['account_linking'])) {

            $account_linking = $message['account_linking'];

            if ($account_linking['status'] === "linked"){

                $user_id = $account_linking['authorization_code'];

                if ( ($user = User::find($user_id)) !== null){

                    $user->update(['facebook_sending_id' => $message['sender']['id']]);

                    $botman->say("Wecome {$user->name} ! You're account has been successfully linked to messenger ",
                        $user->facebook_sending_id);
                }
            }
        }

        $botman->hears('Login', function (BotMan $bot) {
            $bot->reply(GenericTemplate::create()
                ->addElements([
                    Element::create('Account linking')
                        ->subtitle('All about BotMan')
                        ->addButton(
                            ElementButton::create('Login')
                                ->url(env('APP_URL') . '/botman/authorize')
                                ->type('account_link')
                        )
                ])
            );
        });


        // give the bot something to listen for.
        $botman->hears('Hi', function (BotMan $bot) {
            $bot->reply('Hello ! A lot of new features are coming, see you soon ;) I hope will like it !');
        });

        $botman->hears('Hi Edgar', function (BotMan $bot) {
            $bot->reply("Hello {$bot->getUser()->getFirstName()} !");
        });

        // give the bot something to listen for.
        $botman->hears('Thanks', function (BotMan $bot) {
            $bot->reply("You are welcome!");
        });

        $botman->hears('important', function( BotMan $bot) {
            $bot->types();

            $user = $this->getCurrentUser($bot);
            $response = false;
            if ($user !== null){
                $user->goals()
                    ->where('today', true)
                    ->whereNull('completed_at')
                    ->chunk(4, function ($goals) use($bot, &$response){
                        $response = true;
                        $bot->reply($this->goalListRender($goals));
                    });
                if (!$response){
                    $bot->reply("No goal founded");
                }

            } else {
                $bot->reply('You have to connect to sir edgar. Ask \"Login\"');
            }
        });


        $botman->hears('estimated time {operator} {time}', function( BotMan $bot, $operator, $time) {
            $bot->types();

            $user = $this->getCurrentUser($bot);
            $response = false;
            if ($user !== null){

                $user->goals()
                    ->whereNull('completed_at')
                    ->whereNotNull('estimated_time')
                    ->where('estimated_time', $operator, (int)$time)
                    ->chunk(4, function ($goals) use($bot, &$response){
                        $response = true;
                        $bot->reply($this->goalListRender($goals));
                    });
                if (!$response){
                    $bot->reply("No goal founded");
                }

            } else {
                $bot->reply('You have to connect to sir edgar. Ask \"Login\"');
            }
        });

        $botman->hears('due today', function(BotMan $bot) {
            $bot->types();

            $user = $this->getCurrentUser($bot);
            $response = false;
            if ($user !== null){

                $user->goals()
                    ->whereNull('completed_at')
                    ->whereNotNull('due_date')
                    ->where('due_date', '>=', Carbon::today($user->timezone))
                    ->where('due_date', '<', Carbon::tomorrow($user->timezone))
                    ->chunk(4, function ($goals) use($bot, &$response){
                        $response = true;
                        $bot->reply($this->goalListRender($goals));
                    });
                if (!$response){
                    $bot->reply("No goal founded");
                }

            } else {
                $bot->reply('You have to connect to sir edgar. Ask \"Login\"');
            }
        });


        $botman->hears('project.goals:{projectId}', function( BotMan $bot, $projectId) {
            $user = $this->getCurrentUser($bot);
            if ($user !== null){
                $project = $user->projects()->find($projectId);
                if ($project !== null) {
                    $goals = $project->goals()->whereNull('completed_at')->chunk(4 , function ($goals) use ($bot){
                        $bot->types();
                        $bot->reply($this->goalListRender($goals));
                    });
                } else {
                    $bot->reply('Project does not exist anymore..');
                }
            } else {
                $bot->reply('You have to connect to sir edgar. Ask \"Login\"');
            }
        });


        $botman->hears('projects', function( BotMan $bot) {

            $user = $this->getCurrentUser($bot);

            if ($user !== null){

                $projects = $user->projects()->chunk(4, function($projects) use($bot){
                    $bot->types();
                    $project_list = ListTemplate::create()
                        ->useCompactView();
                        //->addGlobalButton(ElementButton::create('view more')->url('http://test.at'));
                    foreach($projects as $project){

                        $nbTodo = $project->goals()->whereNull('completed_at')->count();
                        $description = "Goals to complete : {$nbTodo}";

                        $project_list->addElement(
                            Element::create($project->title)
                                ->subtitle($description)
                                ->addButton(
                                    ElementButton::create('Display goals')
                                        ->type('postback')
                                        ->payload("project.goals:{$project->id}")
                                )
                        );
                    }
                    $bot->reply($project_list);
                });





            } else {
                $bot->reply('You have to connect to sir edgar. Ask \"Login\"');
            }

        });

        $botman->hears('goal.complete:{id}', function (BotMan $bot, $id) {

            $user = $this->getCurrentUser($bot);
            if ($user !== null) {

                $goal = $user->goals()->with('project')->find($id);
                if ($goal !== null) {

                    $goal->setCompleted();
                    $goal->save();
                    $bot->reply("Goal \"{$goal->title}\" set as completed");

                } else {
                    $bot->reply("Goal doesn't exist anymore");
                }

            } else {
                $bot->reply('You have to connect to sir edgar. Ask \"Login\"');
            }
        });

        $botman->hears('select:{id}', function (BotMan $bot, $id) {

            $user = $this->getCurrentUser($bot);
            if ($user !== null){

                $goal = $user->goals()->with('project')->find($id);
                if ($goal !== null){

                    $bot->reply($this->goalRender($goal));


                } else {
                    $bot->reply("Goal doesn't exist anymore");
                }

            } else {
                $bot->reply('You have to connect to sir edgar. Ask \"Login\"');
            }

        });

        $botman->hears('/expense {price} {currency} {tags}', function(Botman $bot, $price, $currency, $tags){
            $user = $this->getCurrentUser($bot);
            if ($user !== null) {

                $tagsArray = [];

                $price = str_replace(',', '.', $price);

                foreach (explode('#', $tags) as $tag){
                    if (!empty($tag)){
                        $tagsArray []= $tag;
                    }
                }

                $ft = FinancialTransaction::create([
                    'user_id' => $user->id,
                    'price' => (float)$price,
                    'currency' => $currency,
                    'tags' => $tagsArray,
                    'type' => FinancialTransaction::EXPENSE,
                ]);


                $bot->reply($ft->toString());

            } else {
                $bot->reply('You have to connect to sir edgar. Ask \"Login\"');
            }
        });

        $botman->hears('/entrance {price} {currency} {tags}', function(Botman $bot, $price, $currency, $tags){
            $user = $this->getCurrentUser($bot);
            if ($user !== null) {

                $tagsArray = [];

                $price = str_replace(',', '.', $price);

                foreach (explode('#', $tags) as $tag){
                    if (!empty($tag)){
                        $tagsArray []= $tag;
                    }
                }

                $ft = FinancialTransaction::create([
                    'user_id' => $user->id,
                    'price' => (float)$price,
                    'currency' => $currency,
                    'tags' => $tagsArray,
                    'type' => FinancialTransaction::ENTRANCE,
                ]);


                $bot->reply($ft->toString());

            } else {
                $bot->reply('You have to connect to sir edgar. Ask \"Login\"');
            }
        });

        $botman->hears('expenses', function(Botman $bot){
            $user = $this->getCurrentUser($bot);
            if ($user !== null) {

                $expenses = $user->financialTransactions()
                    ->where('created_at', '>=', Carbon::today($user->timezone))
                    ->get();

                $list = "";

                foreach ($expenses as $expense){
                    $list .= $expense->toString() . "\r\n";
                }


                $bot->reply($list);

            } else {
                $bot->reply('You have to connect to sir edgar. Ask \"Login\"');
            }
        });


        $botman->fallback(function($bot) {
            $bot->reply('Sorry, I did not understand these commands. Please retry :)');
        });


        // start listening
        $botman->listen();

    }
    public function goalRender(Goal $goal){
        $description =
            "Project  : {$goal->project->title}\r\n" .
            "Score    : {$goal->score}\r\n";

        if ($goal->priority !== null){
            $description .= "Priority : {$goal->priority}\r\n";
        }

        if ($goal->due_date !== null){
            $description .= "Due Date : {$goal->due_date}\r\n";
        }

        return GenericTemplate::create()->addElement(Element::create($goal->title)
            ->subtitle($description)
            ->addButton(ElementButton::create('Set completed')
                ->type('postback')
                ->payload('goal.complete:' . $goal->id)
            )
        );
    }

    private function goalListRender($goals){
        if (count($goals) == 1){
            return $this->goalRender($goals[0]);
        }

        $goalList = ListTemplate::create()
            ->useCompactView();
        //->addGlobalButton(ElementButton::create('view more')->url('http://test.at'));

        foreach ($goals as $goal){

            $goalList->addElement(
                Element::create($goal->title)
                    ->subtitle($goal->project->title)
                    //->image('http://botman.io/img/botman-body.png')
                    ->addButton(ElementButton::create('Select')
                        ->type('postback')
                        ->payload('select:' . $goal->id))


            );
        }
        return $goalList;
    }


    private function getCurrentUser(BotMan $bot){
        return User::where('facebook_sending_id', $bot->getUser()->getId())->first();
    }

    public function authorizeRequest(Request $request){

        $redirect_uri = $request->get('redirect_uri');
        $account_linking_token = $request->get('account_linking_token');


        return view('auth.messenger_login', [
            'redirect_uri' => $redirect_uri,
            'account_linking_token' => $account_linking_token,
        ]);

    }

    public function authorizePost(Request $request){

        $this->validate($request, [
            'redirect_uri' => 'required',
            'account_linking_token' => 'required',
            'email' => 'required',
            'password' => 'required',
        ]);


        if (Auth::once([
            'email' => $request->get('email'),
            'password' => $request->get('password'),
        ])) {

            $user = Auth::user();

            return Redirect::to($request->get('redirect_uri') . '&authorization_code=' . $user->id);

        }

        return Redirect::to($request->get('redirect_uri'));
    }



}