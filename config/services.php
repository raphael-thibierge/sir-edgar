<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
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
        'facebook_verification' => env('FACEBOOK_VERIFICATION'), // Optional - this is used to verify incoming API calls,

        'wechat_app_id' => 'YOUR-WECHAT-APP-ID',
        'wechat_app_key' => 'YOUR-WECHAT-APP-KEY',
    ],

    'facebook' => [
        'page_id' => env('FACEBOOK_PAGE_ID'),
        'page_token' => env('FACEBOOK_TOKEN'),
        'app_secret' => env('FACEBOOK_APP_SECRET'),
        'app_verification' => env('FACEBOOK_VERIFICATION'),
    ]

];
