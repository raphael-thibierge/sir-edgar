<?php

namespace App\Console\Commands;

use App\Jobs\UpdateCoinbasePriceJob;
use App\Services\CoinbaseService;
use Illuminate\Console\Command;

class CoinbasPriceCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'coinbase:price:update';

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
        dispatch(new UpdateCoinbasePriceJob());
    }
}
