<?php

namespace App;


use Carbon\Carbon;
use Jenssegers\Mongodb\Eloquent\Model;
use Jenssegers\Mongodb\Relations\BelongsTo;

/**
 * @property string type
 * @property mixed price
 * @property mixed currency
 * @property array|mixed tags
 * @property string title
 * @property Carbon created_at
 * @property string user_id
 */
class FinancialTransaction extends Model
{
    const EXPENSE = "expense";
    const ENTRANCE = "entrance";
    const SAVING = "saving";

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
        'date',
    ];

    protected $dates = [
        'date',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'price' => 'float'
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


    public function tagsEdit()
    {
        $tags = [];

        $words = explode(' ', strtolower($this->title));

        foreach ($words as $word){
            if (!empty($word) && strpos($word, '#') === 0){
                $tag = trim($word, '#');
                if (!in_array($tag, $tags)){
                    $tags []= $tag;
                }
            }
        }

        $this->tags = $tags;
        $this->title = str_replace('#' , '', $this->title);
    }
}
