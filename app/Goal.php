<?php

namespace App;

use Jenssegers\Mongodb\Eloquent\Model;
use Jenssegers\Mongodb\Relations\BelongsTo;

class Goal extends Model
{
    /**
     * Mongo collection
     * @var string
     */
    protected $collection = 'goals';

    /**
     * Mongo document primary key
     * @var string
     */
    protected $primaryKey = '_id';

    /**
     * Mongo document fields
     * @var array
     */
    protected $fillable = [
        'title',
        'score',
        'tags',
        'accomplished_by_id',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'routes',
    ];

    /**
     * @return BelongsTo
     */
    public function accomplished_by(): BelongsTo {
        return $this->belongsTo('App\User', 'accomplished_by_id', '_id');
    }


    public function routes(): array {
        return [
            'store'     => route('goals.store'),
            'update'    => route('goals.update', ['goal', $this->id]),
        ];
    }







}
