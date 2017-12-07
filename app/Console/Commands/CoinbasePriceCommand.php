<?php

namespace App\Console\Commands;

use App\Jobs\UpdateCoinbasePriceJob;
use App\Notifications\MessengerNotification;
use App\Services\CoinbaseService;
use App\User;
use Coinbase\Wallet\Exception\ServiceUnavailableException;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class CoinbasePriceCommand extends Command
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

    const CACHE_KEY = 'coinbase-api-status';

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
