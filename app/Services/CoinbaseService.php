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

class CoinbaseService implements OAuthInterface
{

    const SCOPES = [
        'wallet:accounts:read',
        'wallet:accounts:update',
        'wallet:accounts:create',
        'wallet:accounts:delete',
        'wallet:addresses:read',
        'wallet:addresses:create',
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
        'wallet:payment-methods:delete',
        'wallet:payment-methods:limits',
        'wallet:sells:read',
        'wallet:sells:create',
        'wallet:transactions:read',
        'wallet:transactions:send',
        'wallet:transactions:request',
        'wallet:transactions:transfer',
        'wallet:user:read',
        'wallet:user:update',
        'wallet:user:email',
        'wallet:withdrawals:read',
        'wallet:withdrawals:create',
    ];


    public static function connectWithAPI(){

        $apiKey = env('COINBASE_API_KEY');
        $apiSecret = env('COINBASE_API_SECRET');

        $configuration = Configuration::apiKey($apiKey, $apiSecret);
        $client = Client::create($configuration);

        return $client;
    }

    public function getAuthUrl()
    {
        $url = 'https://www.coinbase.com/oauth/authorize';


        $parameters = [
            'client_id' => $this->getClientId(),
            'redirect_uri' => $this->getRedirectUri(),
            'response_type' => 'code',
            'scope' => isset($options['scope']) ? implode(' ', $options['scope']) : null,
            'show_dialog' => !empty($options['show_dialog']) ? 'true' : null,
            'state' => $options['state'] ?? null,
        ];

        return Request::ACCOUNT_URL . '/authorize/?' . http_build_query($parameters);
    }

    public function getTokenUrl()
    {
        return 'http://www.coinbase.com/oauth/token';
    }

    public function getRedirectUri()
    {
        return env('APP_URL');
    }

    public function getAccessRequestUrl()
    {
        $clientId = "a";
        $code = "coucou";
        $redirectUri = $this->getRedirectUri();
        $scopes = $this->getScopes();

        return $this->getAuthUrl() .
            "?response_type=code&client_id=$clientId&redirect_uri=$redirectUri&state=$code&scope=$scopes";
    }

    public function getExchangeTokenUrl()
    {

    }

    public function getScopes()
    {
        return implode(',', self::SCOPES);
    }
}