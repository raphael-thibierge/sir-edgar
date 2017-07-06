<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;
use Jenssegers\Mongodb\Relations\BelongsTo;

class Goal extends Model
{

    protected $primaryKey = '_id';

    protected $fillable = [
        'title',
        'score',
        'tags',
        'accomplished_by_id',
    ];

    protected $collection = 'mongodb';


    /**
     * @return BelongsTo
     */
    public function accomplished_by(): BelongsTo {
        return $this->belongsTo('App\User', 'accomplished_by_id', '_id');
    }






}
