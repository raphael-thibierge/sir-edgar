<?php

namespace App\Console\Commands;

use App\Mail\DailyGoalsReportMail;
use App\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class DailyGoalsReportCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'report:goals:daily {user_id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send daily achieved goals by email';

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

        User::all()->each(function($user){
            Mail::to($user)->send(new DailyGoalsReportMail($user));
        });
    }
}
