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
        'progress',
        'expenses'
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
            $startDate = Carbon::now($this->user->timezone)->startOfMonth()->startOfDay();
            $endDate = Carbon::now($this->user->timezone)->endOfMonth()->endOfDay();
        }


        $query = FinancialTransaction::
            where('user_id', $this->user_id)
            ->where('type', FinancialTransaction::EXPENSE)
            ->where('currency', $this->currency)
            ->where('date', '>=', $startDate)
            ->where('date', '<', $endDate);

        if (isset($this->tags) && count($this->tags) > 0){
            $query->whereRaw(['tags' => ['$in' => $this->tags]]);
        }
        return $query;
    }

    public function getTotalAttribute(){
        return $this->expenses()->sum('price');
    }

    public function getExpensesAttribute(){
        return $this->expenses()->get();
    }

    public function getProgressAttribute(){
        return (int)(($this->getTotalAttribute() / $this->amount ) * 100 );
    }

    public function toString(): string {
        return "$this->name /$this->period : " . $this->getProgressAttribute() .'% --> ' . $this->getTotalAttribute()  . ' ' . $this->currency;
    }
}
