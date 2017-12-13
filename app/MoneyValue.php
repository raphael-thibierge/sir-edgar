<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;

/**
 * Class CryptoValue
 * @package App
 * @property string source
 * @property string native_currency
 * @property string currency
 * @property float amount
 */
class MoneyValue extends Model
{
    protected $collection = 'money_values';

    protected $primaryKey = '_id';

    protected $fillable = [
        'source',
        'currency',
        'native_currency',
        'spot_price',
        'sell_price',
        'buy_price'
    ];

    protected $dates = [
        'created_at',
        'updated_at'
    ];

}
