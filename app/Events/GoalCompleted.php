<?php

namespace App\Events;

use App\Goal;
use App\Notifications\MessengerNotification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class GoalCompleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;


    /**
     * @var Goal
     */
    private $goal;

    /**
     * Create a new event instance.
     *
     * @param Goal $goal
     */
    public function __construct(Goal $goal)
    {
        $this->goal = $goal;
        $this->sendProgressOverMessenger();
    }

    public function sendProgressOverMessenger(){

        if ($this->goal->user->hasMessenger()) {

            // get user's scores
            $userScore = $this->goal->user->getCurrentScore();
            $intent = $this->goal->user->daily_score_goal;
            $goalScore = $this->goal->score;
            $progress = $this->goal->user->currentProgress();

            if ($userScore < $intent) {
            // send message for 50% progress
                if ($userScore >= ($intent / 2) && $userScore - $goalScore < $intent / 2) {
                    $this->goal->user->notify(new MessengerNotification("You achieve $progress%, continue like this!"));
                }
            } else if ($userScore - $goalScore < $intent) {
            // send message for 100% progress
                $this->goal->user->notify(new MessengerNotification("Well done, you complete $progress% of your day !"));
            }
        }

    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('App.User.' . $this->goal->user->id);
    }

    /**
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'goal' => [
                '_id' => $this->goal->id,
                'score' => $this->goal->score,
            ],
        ];
    }
}
