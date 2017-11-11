<?php

namespace App\Console\Commands;

use App\Notifications\MessengerGenericNotification;
use App\Notifications\MessengerNotification;
use App\Goal;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckRemindersCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reminders:check';

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
        $start = Carbon::now()->second(0);
        $end = Carbon::now()->second(0)->addMinute(1);
        $goals = Goal::whereNull('completed_at')
            ->where('due_date', '>=', $start)
            ->where('due_date', '<', $end)
            ->get();

        foreach ($goals as $goal){
            if (isset($goal->user->facebook_sending_id) && $goal->user->facebook_sending_id !== null){
                $goal->user->notify(
                    new MessengerNotification("Bip bip ! I remind you to do : \r\n" . $goal->title . " ($goal->score)")
                );
            }
        }

    }
}
