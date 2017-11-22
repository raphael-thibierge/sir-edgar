<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, SparkPost and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
    ],

    'ses' => [
        'key' => env('SES_KEY'),
        'secret' => env('SES_SECRET'),
        'region' => 'us-east-1',
    ],

    'sparkpost' => [
        'secret' => env('SPARKPOST_SECRET'),
    ],

    'stripe' => [
        'model' => App\User::class,
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
    ],

    'botman' => [
        'hipchat_urls' => [
            'YOUR-INTEGRATION-URL-1',
            'YOUR-INTEGRATION-URL-2',
        ],

        'nexmo_key' => 'YOUR-NEXMO-APP-KEY',
        'nexmo_secret' => 'YOUR-NEXMO-APP-SECRET',
        'microsoft_bot_handle' => 'YOUR-MICROSOFT-BOT-HANDLE',
        'microsoft_app_id' => 'YOUR-MICROSOFT-APP-ID',
        'microsoft_app_key' => 'YOUR-MICROSOFT-APP-KEY',
        'slack_token' => 'YOUR-SLACK-TOKEN-HERE',

        'telegram_token' => env('TELEGRAM_TOKEN'),

        'facebook_token' => env('FACEBOOK_TOKEN'),
        'facebook_app_secret' => env('FACEBOOK_APP_SECRET'), // Optional - this is used to verify incoming API calls,

        'wechat_app_id' => 'YOUR-WECHAT-APP-ID',
        'wechat_app_key' => 'YOUR-WECHAT-APP-KEY',
    ],


    'coinbase' => [
        'key' => 'ea7c5c606d51df5d3c7135b94d5eddfd8510d2d4b4d166e8e5b9642696db745e',
        'secret' => 'af4ff4468a6c036dcc4ae33daaa11f992a8f9e7734b6df03d4a3cdef4850fc9f',
        'redirect_uri' => 'https://www.sir-edgar.com/oauth/redirect/coinbase'
    ]

];
