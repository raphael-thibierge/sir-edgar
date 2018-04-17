<?php

namespace App;

use Carbon\Carbon;
use Jenssegers\Mongodb\Eloquent\Model;

/**
 * Class OAuthConnection
 * @package App
 *
 * @property string access_token
 * @property string refresh_token
 * @property int token_expiration
 * @property string service
 * @property array user_data
 */
class OAuthConnection extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'o_auth_connections';

    protected $fillable = [
        'access_token',
        'refresh_token',
        'token_expiration',
        'service',
        'user_data',
        'user_id'
    ];

    protected $hidden = [
        'access_token',
        'refresh_token',
    ];
    
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo {
        return $this->belongsTo('App\User');
    }

    public function tokenHasExpired(): bool {
        $expiration_date = new Carbon();
        $expiration_date->timestamp = $this->token_expiration;
        return Carbon::now()->greaterThanOrEqualTo($expiration_date);
    }

}
