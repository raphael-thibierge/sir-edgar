<?php

namespace App\Http\Controllers;


use App\Events\PusherDebugEvent;
use App\User;
use BotMan\BotMan\BotMan;
use BotMan\BotMan\BotManFactory;
use BotMan\BotMan\Drivers\DriverManager;
use BotMan\Drivers\Facebook\Extensions\Element;
use BotMan\Drivers\Facebook\Extensions\ElementButton;
use BotMan\Drivers\Facebook\Extensions\GenericTemplate;
use BotMan\Drivers\Facebook\FacebookDriver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Pusher;

class BotManController extends Controller
{



    public function handle(Request $request)
    {


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


        // give the bot something to listen for.
        $botman->hears('Hi', function (BotMan $bot) {
            $bot->reply('Hello ! A lot of new features are coming, see you soon ;) I hope will like it !');
        });

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



        $botman->hears('important goals', function( BotMan $bot) {
            $user = User::where('facebook_sending_id', $bot->getUser()->getId())->first();

            if ($user !== null){

                $goals = $user->goals()->select(['title'])->get()->implode('title', "\r\n");

                $bot->reply($goals);

            } else {
                $bot->reply('You have to connect to sir edgar. Ask \"Login\"');

            }

        });




        // start listening
        $botman->listen();

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