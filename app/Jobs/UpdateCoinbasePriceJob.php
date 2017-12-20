<?php

namespace App\Jobs;

use App\Events\UpdateCoinbaseEvent;
use App\MoneyValue;
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

        $data = [];

        $native_currency = 'EUR';

        foreach (['BTC', 'ETH', 'LTC', 'BCH'] as $cryptoCurrency){

            $conversion = $cryptoCurrency . '-' . $native_currency;

            $data[$cryptoCurrency] = MoneyValue::create([
                'native_currency' => $native_currency,
                'currency' => $cryptoCurrency,
                'source' => 'coinbase',
                'sell_price' => floatval($client->getSellPrice($conversion)->getAmount()),
                'spot_price' => floatval($client->getSpotPrice($conversion)->getAmount()),
                'buy_price' => floatval($client->getBuyPrice($conversion)->getAmount()),
            ]);
        }

        event(new UpdateCoinbaseEvent($data));
    }
}
