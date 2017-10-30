<?php
/**
 * Created by PhpStorm.
 * User: raphael
 * Date: 30/10/2017
 * Time: 15:07
 */

namespace App\Channels;

use Illuminate\Notifications\Notification;
use BotMan\Drivers\Facebook\FacebookDriver;
use BotMan\BotMan\BotManFactory;
use BotMan\BotMan\Drivers\DriverManager;

class MessengerChannel
{
    /**
     * Send the given notification.
     *
     * @param  mixed  $notifiable
     * @param  \Illuminate\Notifications\Notification  $notification
     * @return void
     */
    public function send($notifiable, Notification $notification)
    {
        // get notification content
        $message = $notification->toMessenger($notifiable);

        // get user's sender id
        $senderId = $notifiable->facebook_sending_id;

        // Load Facebook messenger driver
        DriverManager::loadDriver(FacebookDriver::class);

        // Define botman config
        $config = [
            'facebook' => [
                'token' => env('FACEBOOK_TOKEN'),
                'app_secret' => env('FACEBOOK_APP_SECRET'),
                'verification' => env('FACEBOOK_VERIFICATION'),
            ]
        ];

        // Create BotMan instance
        $botman =  BotManFactory::create($config);

        // send notification with messenger
        $botman->say($message, $senderId, FacebookDriver::class);

    }
}