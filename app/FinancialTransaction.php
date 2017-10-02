<?php

namespace App;


use Jenssegers\Mongodb\Eloquent\Model;

/**
 * @property string type
 * @property mixed price
 * @property mixed currency
 */
class FinancialTransaction extends Model
{
    const EXPENSE = "expense";
    const ENTRANCE = "entrance";

    protected $primaryKey = '_id';

    protected $collection = 'financial_transactions';

    protected $fillable = [
        'title',
        'description',
        'type',
        'user_id',
        'tags',
        'currency',
        'price',
    ];

    protected $dates = [
        'created_at'
    ];

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo {
        return $this->belongsTo('App\User');
    }

    public function toString(){

        $tags = "";
        if (isset($this->tags)){
            foreach ($this->tags as $tag){
                $tags .= '#' . $tag;
            }
        }

        return $this->type . ' : ' . $this->price . $this->currency . ' ' . $tags;
    }

}
