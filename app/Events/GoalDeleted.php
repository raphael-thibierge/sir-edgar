<?php

namespace App\Events;

use App\Goal;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class GoalDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;

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
                'score' => isset($this->goal->completed_at) && $this->goal->completed_at !== null ? $this->goal->score : 0,
            ]
        ];
    }
}
