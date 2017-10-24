<?php

namespace App;


use Carbon\Carbon;
use Jenssegers\Mongodb\Eloquent\Model;

/**
 * @property string currency
 * @property mixed user_id
 * @property float amount
 * @property User user
 * @property string period
 * @property array tags
 */
class Budget extends Model
{

    const PERIOD_WEEK = 'week';
    const PERIOD_MONTHS = 'month';

    protected $collection = 'budgets';

    protected $primaryKey = '_id';

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'total',
    ];

    protected $fillable = [
        'name',
        'period',
        'tags', // used to find transactions
        'user_id',
        'amount',
        'currency',
    ];

    protected $dates = [
        'create_at',
        'updated_at',
    ];


    public function user(){
        return $this->belongsTo('App\User');
    }

    public function expenses(){

        if ($this->period === self::PERIOD_WEEK){
            $startDate = Carbon::now($this->user->timezone)->startOfWeek();
            $endDate = Carbon::now($this->user->timezone)->endOfWeek();
        } else {
            $startDate = Carbon::now($this->user->timezone)->startOfMonth();
            $endDate = Carbon::now($this->user->timezone)->endOfMonth();
        }

        return FinancialTransaction::where('user_id', $this->user_id)
            ->where('type', FinancialTransaction::EXPENSE)
            ->where('currency', $this->currency)
            ->where('tags', '=', $this->tags)
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<', $endDate);
    }

    public function getTotalAttribute(){
        return $this->expenses()->sum('price');
    }

    public function progress(){
        return (int)(($this->getTotalAttribute() / $this->amount ) * 100 );
    }
}
