<?php

namespace App\Console\Commands;

use App\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ConvertGoalToImportantWhenDueDateCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'goals:due-date:important {timezone}';

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
        $timezone = $this->argument('timezone');

        User::where('timezone', $timezone)->each(function (User $user, $key) use($timezone){
            $user->goals()
                ->where('due_date', '>=', Carbon::today($timezone))
                ->where('due_date', '<', Carbon::tomorrow($timezone))
                ->update(['today' => true]);
        });
    }
}
