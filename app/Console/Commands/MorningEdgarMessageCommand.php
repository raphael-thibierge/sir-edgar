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
            . 'Yesterday, your score was ' . $user->yesterday_goals()->sum('score')
            . ', today the intent is ' . $user->daily_score_goal . PHP_EOL
            . 'You spent ' . $user->getTotalCurrentWeekExpensesAttribute() . ' CAD this week '
            . 'and ' . $user->getTotalCurrentMonthExpensesAttribute() . ' CAD this month !' . PHP_EOL;


        $goalsToday =  'You have to comlete this today : ' . PHP_EOL
            . $user->endingTodayGoalsToStringWithEOL();

        $importantGoals =  'And here are important things : ' . PHP_EOL
            . $user->importantGoalsToStringWithEOL();

        $budgets = 'Oh, budgets :' . PHP_EOL
            . $user->allBudgetsToStringWithEOL();




        $user->notify(new MessengerNotification($message));
        $user->notify(new MessengerNotification($goalsToday));
        $user->notify(new MessengerNotification($importantGoals));
        $user->notify(new MessengerNotification($budgets));
    }
}
