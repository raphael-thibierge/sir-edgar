<?php

namespace App\Jobs;

use App\Events\UpdateCoinbaseEvent;
use App\Services\CoinbaseService;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class UpdateCoinbasePriceJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {


        $client = CoinbaseService::connectWithAPI();

        $btc = [
            'sell' => $client->getBuyPrice('BTC-EUR')->getAmount(),
            'spot' => $client->getSpotPrice('BTC-EUR')->getAmount(),
            'buy' => $client->getBuyPrice('BTC-EUR')->getAmount(),
        ];

        $eth = [
            'sell' => $client->getBuyPrice('ETH-EUR')->getAmount(),
            'spot' => $client->getSpotPrice('ETH-EUR')->getAmount(),
            'buy' => $client->getBuyPrice('ETH-EUR')->getAmount(),
        ];

        $ltc = [
            'sell' => $client->getBuyPrice('LTC-EUR')->getAmount(),
            'spot' => $client->getSpotPrice('LTC-EUR')->getAmount(),
            'buy' => $client->getBuyPrice('LTC-EUR')->getAmount(),
        ];

        event(new UpdateCoinbaseEvent([
            'BTC' => $btc,
            'ETH' => $eth,
            'LTC' => $ltc,
        ]));

    }
}
