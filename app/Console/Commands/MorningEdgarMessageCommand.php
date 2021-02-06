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
    protected $signature = 'user:morningMessage {user}';

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
        $user = $this->argument('user') === 'first' ? User::where('admin', true)->first() : User::find($this->argument('user'));
        if ($user === null) return;

        $message = 'Good morning ' . $user->name . ' !' . PHP_EOL
            . 'Score intent ' . $user->daily_score_goal . PHP_EOL
            . 'Yesterday\'s score :' . $user->yesterday_goals()->sum('score') . PHP_EOL
            . 'Week\'s spendings  : ' . $user->getTotalCurrentWeekExpensesAttribute() . ' CAD' . PHP_EOL
            . 'Month\'s spendings : ' . $user->getTotalCurrentMonthExpensesAttribute() . ' CAD' . PHP_EOL;

        $goalsToday =  'You have to comlete this today : ' . PHP_EOL
            . $user->endingTodayGoalsToStringWithEOL();

        $importantGoals =  'And here are the important things : ' . PHP_EOL
            . $user->importantGoalsToStringWithEOL();

        //$budgets = 'Oh, budgets :' . PHP_EOL
        //    . $user->allBudgetsToStringWithEOL();

        $user->notify(new MessengerNotification($message));
        $user->notify(new MessengerNotification($goalsToday));
        $user->notify(new MessengerNotification($importantGoals));
        //$user->notify(new MessengerNotification($budgets));
    }
}
