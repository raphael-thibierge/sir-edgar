<?php

namespace App\Mail;

use App\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewUserRegistration extends Mailable
{
    use Queueable, SerializesModels;
    /**
     * @var User
     */
    private $userRegistered;

    /**
     * Create a new message instance.
     * @param User $userRegistered
     */
    public function __construct(User $userRegistered)
    {
        $this->userRegistered = $userRegistered;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.admin.register')
            ->with('user', $this->userRegistered);
    }
}
