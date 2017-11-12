<?php

namespace App\Notifications;

use App\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Channels\MessengerChannel;

class MessengerNotification extends Notification
{
    use Queueable;

    private $messageContent;

    /**
     * Create a new notification instance.
     * @param $content
     */
    public function __construct($content)
    {
        $this->messageContent = $content;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return [MessengerChannel::class ];
    }

    /**
     * Return the content to messenger
     *
     * @return mixed
     */
    public function toMessenger()
    {
        return $this->messageContent;
    }
}