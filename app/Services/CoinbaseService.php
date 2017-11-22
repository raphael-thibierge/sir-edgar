<?php
/**
 * Created by PhpStorm.
 * User: raphael
 * Date: 16/11/2017
 * Time: 10:08
 */

namespace App\Services;


use Coinbase\Wallet\Client;
use Coinbase\Wallet\Configuration;

class CoinbaseService extends OAuthService
{

    protected $authorize_url = 'https://www.coinbase.com/oauth/authorize';

    protected $token_url = 'http://www.coinbase.com/oauth/token';

    protected $service = 'coinbase';

    protected $scopes = [
        'wallet:accounts:read',
        'wallet:accounts:update',
        //'wallet:accounts:create',
        //'wallet:accounts:delete',
        'wallet:addresses:read',
        //'wallet:addresses:create',
        'wallet:buys:read',
        'wallet:buys:create',
        'wallet:checkouts:read',
        'wallet:checkouts:create',
        'wallet:deposits:read',
        'wallet:deposits:create',
        'wallet:notifications:read',
        'wallet:orders:read',
        'wallet:orders:create',
        'wallet:orders:refund',
        'wallet:payment-methods:read',
        //'wallet:payment-methods:delete',
        'wallet:payment-methods:limits',
        'wallet:sells:read',
        'wallet:sells:create',
        'wallet:transactions:read',
        //'wallet:transactions:send',
        //'wallet:transactions:request',
        //'wallet:transactions:transfer',
        'wallet:user:read',
        //'wallet:user:update',
        //'wallet:user:email',
        'wallet:withdrawals:read',
        'wallet:withdrawals:create',
    ];

    protected $options = [
        'account' => 'all',
    ];

    public static function connectWithAPI(){

        $apiKey = env('COINBASE_API_KEY');
        $apiSecret = env('COINBASE_API_SECRET');

        $configuration = Configuration::apiKey($apiKey, $apiSecret);
        $client = Client::create($configuration);

        return $client;
    }

}