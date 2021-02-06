<?php

namespace App\Mail;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class DailyGoalsReportMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @var User
     */
    private $user;

    /**
     * Create a new message instance.
     * @param User $user
     * @internal param int $number_of_days
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $goals = $this->user->yesterday_goals()
            ->select(['title', 'score', 'completed_at', 'project_id'])
            ->orderBy('project_id')
            ->with('project')
            ->get();

        return $this->markdown('emails.goals.report')
            ->with([
                'goals' => $goals,
                'period' => 'yesterday'
            ]);
    }
}
