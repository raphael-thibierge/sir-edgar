<?php

namespace App\Http\Controllers;

use App\Conversations\MorningConversation;
use App\Goal;
use App\User;

use BotMan\BotMan\Messages\Outgoing\Actions\Button;
use BotMan\Drivers\Facebook\Extensions\Element;
use BotMan\Drivers\Facebook\Extensions\ElementButton;
use BotMan\Drivers\Facebook\Extensions\GenericTemplate;
use Illuminate\Http\Request;
use Mockery\Exception;
use Mpociot\BotMan\BotMan;

class BotManController extends Controller
{



    public function handle()
    {

        $botman = app('botman');
        $botman->verifyServices(env('FACEBOOK_VERIFICATION'));

        // give the bot something to listen for.
        $botman->hears('Hi', function (BotMan $bot) {
            $bot->reply('Hello ! A lot of new features are coming ! See you soon ;)');
        });

        // start listening
        $botman->listen();

    }

}