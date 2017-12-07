<?php

namespace App\Console;

use App\Console\Commands\AdminCoinBaseCommand;
use App\Console\Commands\CheckCoinbaseApiStatusCommand;
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
        DailyGoalsReportCommand::class,
        CheckRemindersCommand::class,
        DailyGoalsReportCommand::class,
        MorningEdgarMessageCommand::class,
        ImportantNotificationEdgar::class,
        AdminCoinBaseCommand::class,
        CoinbasePriceCommand::class,
        CoinbaseFeesCommand::class,
        CheckCoinbaseApiStatusCommand::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('coinbase:price:update')->everyMinute();
        $schedule->command('coinbase:api:status')->everyMinute();

        // server monitoring
        $schedule->command('monitor:run')->daily()->at('10:00');
        $schedule->command('monitor:run HttpPing')->hourly();

        foreach (timezone_identifiers_list() as $timezone){
           // $schedule->command('report:goals:daily')
            //    ->timezone($timezone)
            //    ->dailyAt(0);

            $schedule->command('goals:check ' . $timezone)
                ->timezone($timezone)
                ->dailyAt(8);
        }

        $schedule->command('reminders:check')
            ->everyMinute();

        // raphael
        $schedule->command('user:morningMessage first')
            ->timezone('America/Toronto')
            ->dailyAt('08:30');


        // arthur
        $schedule->command('user:morningMessage 59ca9b30b2530a3d1345003e')
            ->timezone('America/Toronto')
            ->dailyAt('08:30');


        $schedule->command('goals:important:messenger')->hourly();

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
