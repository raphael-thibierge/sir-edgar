<?php

namespace App\Console\Commands;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ConvertGoalToImportantWhenDueDateCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'goals:important';

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
        User::each(function (User $user){
            $user->goals()
                //->where('due_date', '>=', Carbon::today($timezone))
                ->where('due_date', '<', Carbon::tomorrow($user->timezone)->startOfDay())
                ->update(['today' => true]);
        });
    }
}
