<?php

namespace App\Console;

use App\Console\Commands\AdminCoinBaseCommand;
use App\Console\Commands\CoinbaseCheckApiStatusCommand;
use App\Console\Commands\CheckRemindersCommand;
use App\Console\Commands\CoinbaseFeesCommand;
use App\Console\Commands\CoinbasePriceCommand;
use App\Console\Commands\DailyGoalsReportCommand;
use App\Console\Commands\ImportantNotificationEdgar;
use App\Console\Commands\MorningEdgarMessageCommand;
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

    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {

        //$schedule->command('coinbase:price:update')->everyMinute();
        //$schedule->command('coinbase:api:status')->everyMinute();

        $schedule->command('horizon:snapshot')->everyFiveMinutes();

        foreach (timezone_identifiers_list() as $timezone){

            $schedule->command('goals:check ' . $timezone)
                ->timezone($timezone)
                ->dailyAt(8);

        }

        $schedule->command('goals:important ' . $timezone)
            ->timezone($timezone)
            ->dailyAt(0);

        $schedule->command('reminders:check')
            ->everyMinute();

        // raphael
        $schedule->command('user:morningMessage first')
            ->timezone('America/Toronto')
            ->dailyAt('7:00');


        //$schedule->command('goals:important:messenger')->hourly();

    }

    /**
     * Register the Closure based commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        require base_path('routes/console.php');
        $this->load(__DIR__.'/Commands');
    }
}
