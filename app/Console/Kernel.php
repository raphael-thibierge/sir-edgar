<?php

namespace App\Console;

use App\Console\Commands\CheckRemindersCommand;
use App\Console\Commands\DailyGoalsReportCommand;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        DailyGoalsReportCommand::class,
        CheckRemindersCommand::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {

        foreach (timezone_identifiers_list() as $timezone){
            $schedule->command('report:goals:daily')
                ->timezone($timezone)
                ->dailyAt(0);
        }

        $schedule->command('reminders:check')
            ->timezone('America/Toronto')
            ->dailyAt('16:02');
    }

    /**
     * Register the Closure based commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        require base_path('routes/console.php');
    }
}
