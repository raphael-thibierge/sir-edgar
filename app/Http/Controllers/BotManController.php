<?php

namespace App\Http\Controllers;


use BotMan\BotMan\BotMan;
use BotMan\BotMan\BotManFactory;
use BotMan\BotMan\Drivers\DriverManager;
use BotMan\Drivers\Facebook\FacebookDriver;

class BotManController extends Controller
{



    public function handle()
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


        //$botman = app('botman');
        //$botman->verifyServices(env('FACEBOOK_VERIFICATION'));

        // give the bot something to listen for.
        $botman->hears('Hi', function (BotMan $bot) {
            $bot->reply('Hello ! A lot of new features are coming, see you soon ;) I hope will like it !');
        });


        // start listening
        $botman->listen();

    }

}