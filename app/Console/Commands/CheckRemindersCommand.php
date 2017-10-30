<?php

namespace App\Console\Commands;

use App\Notifications\MessengerGenericNotification;
use App\Notifications\MessengerNotification;
use App\User;
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
        User::where('admin', true)->whereNotNull('facebook_sending_id')->each(function ($user, $key){

            $dateStart = Carbon::today($user->timezone)->startOfDay();
            $dateEnd = Carbon::tomorrow($user->timezone)->startOfDay();

            $goals = $user->goals()
                ->whereNull('completed_at')
                ->where('due_date', '>=', $dateStart)
                ->where('due_date', '<', $dateEnd)
                ->pluck('title')
                ->toArray();

            $user->notify(new MessengerNotification("Today : \r\n" . implode('\r\n', $goals)));

        });
    }
}
