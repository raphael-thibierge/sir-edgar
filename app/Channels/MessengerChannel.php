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

        if (!$notifiable->hasMessenger()){
            return;
        }

        // get user's sender id
        $senderId = $notifiable->facebook_sending_id;

        // Load Facebook messenger driver
        DriverManager::loadDriver(FacebookDriver::class);

        // Define botman config
        $config = [
            'facebook' => [
                'token' => config('services.facebook.page_token'),
                'app_secret' => config('services.facebook.app_secret'),
                'verification' => config('services.facebook.app_verification'),
            ]
        ];

        // Create BotMan instance
        $botman =  BotManFactory::create($config);

        // send notification with messenger
        $botman->say($message, $senderId, FacebookDriver::class);

    }
}
