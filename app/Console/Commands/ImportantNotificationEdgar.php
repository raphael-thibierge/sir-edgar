<?php

namespace App\Console\Commands;

use App\Notifications\MessengerNotification;
use App\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ImportantNotificationEdgar extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'goals:important:messenger';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $user = User::first();

        $importantGoals = $user->goals()
            ->whereNull('completed_at')
            ->where('today', true)
            ->orderBy('priority', 'DESC')
            ->get();

        if (count($importantGoals) === 0){
            return;
        }

        $now = Carbon::now($user->timezone);
        $hour = $heure = $now->hour;
        $startAt = 8;
        if ($hour >= $startAt){

            $offset = ($hour - $startAt) % count($importantGoals);

            $goal = $importantGoals[$offset];

            $message = explode(' ', $user->name)[0] . ", you have to $goal->title ($goal->score), you told me it's important !";

            $user->notify(new MessengerNotification($message));
        }

    }
}
