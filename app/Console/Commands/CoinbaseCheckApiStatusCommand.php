<?php

namespace App\Console\Commands;

use App\Jobs\CheckCoinbaseApiStatusJob;
use Illuminate\Console\Command;

class CoinbaseCheckApiStatusCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'coinbase:api:status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

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
        dispatch(new CheckCoinbaseApiStatusJob());
    }


}
