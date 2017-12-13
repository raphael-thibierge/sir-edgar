<?php

namespace App\Jobs;

use App\Notifications\MessengerNotification;
use App\Services\CoinbaseService;
use App\User;
use Coinbase\Wallet\Exception\HttpException;
use Coinbase\Wallet\Exception\ServiceUnavailableException;
use GuzzleHttp\Exception\ServerException;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Cache;

class CheckCoinbaseApiStatusJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    const CACHE_KEY = 'coinbase-api-status';

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

        try {
            $client->getAccounts();

            if (!Cache::has(self::CACHE_KEY)){
                User::first()->notify(new MessengerNotification('Coinbase API up !'));
                Cache::forever(self::CACHE_KEY, true);
            } else if (Cache::get(self::CACHE_KEY) === false){
                User::first()->notify(new MessengerNotification('Coinbase API up !'));
                Cache::forever(self::CACHE_KEY, true);
            }

        } catch (ServiceUnavailableException $exception){
            $this->apiOff();
        } catch (ServerException $exception){
            $this->apiOff();
        } catch (HttpException $exception){
            $this->apiOff();
        } catch (\Exception $exception){
            $this->apiOff();
        }
    }

    private function apiOff(){
        if (!Cache::has(self::CACHE_KEY)){
            Cache::forever(self::CACHE_KEY, false);
            User::first()->notify(new MessengerNotification('Coinbase API down !'));
        } else if (Cache::get(self::CACHE_KEY)){
            User::first()->notify(new MessengerNotification('Coinbase API down !'));
            Cache::forever(self::CACHE_KEY, false);
        }
    }
}
