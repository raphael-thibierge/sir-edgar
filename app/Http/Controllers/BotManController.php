<?php

namespace App\Http\Controllers;

use App\Conversations\MorningConversation;
use App\Goal;
use App\User;
use Illuminate\Http\Request;
use Mpociot\BotMan\BotMan;

class BotManController extends Controller
{

    public function handle()
    {
        $botman = app('botman');

        // Simple respond method
        $botman->hears('Hello', function (BotMan $bot) {
            $bot->reply('Yoooo :)');
        });

        $botman->hears('New goal', function($bot) {
            $bot->startConversation(new MorningConversation());
        });



        $botman->hears('projects', function (BotMan $bot) {

            $response = implode("\r\n", User::first()->projects()->pluck('title')->toArray());


            $bot->reply($response);
        });

        $botman->hears('todo', function (BotMan $bot) {

            $response = implode("\r\n", Goal::whereNull('completed_at')->pluck('title')->toArray());


            $bot->reply($response);
        });

        $botman->fallback(function($bot) {
            $bot->types();
            $bot->reply('Sorry, I did not understand these commands. Please retype again...');
        });

        $botman->listen();
    }

}