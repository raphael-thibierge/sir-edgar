<?php

namespace App\Http\Controllers;

use App\Conversations\MorningConversation;
use App\Goal;
use App\User;

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
        $botman->hears('hello', function (BotMan $bot) {
            $bot->reply('Hello yourself.');
        });

        // give the bot something to listen for.
        $botman->hears('hi', function (BotMan $bot) {
            $bot->reply('Yooo');
        });

        // start listening
        $botman->listen();



    }

}