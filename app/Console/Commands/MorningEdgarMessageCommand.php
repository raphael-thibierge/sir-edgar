<?php

namespace App\Console\Commands;

use App\Notifications\MessengerNotification;
use App\User;
use Illuminate\Console\Command;

class MorningEdgarMessageCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:morningMessage';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
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
        $message = "Hey " . $user->name . ', it\'s morning report time !' . PHP_EOL
            . 'Yesterday score :' . $user->yesterday_goals()->sum('score') . PHP_EOL
            . 'Score intent : ' . $user->daily_score_goal . PHP_EOL
            . 'Important goals : ' . PHP_EOL
            . $user->endingTodayGoalsToStringWithEOL()
            . 'Budgets :' . PHP_EOL
            . $user->allBudgetsToStringWithEOL();

        $user->notify(new MessengerNotification($message));
    }
}
