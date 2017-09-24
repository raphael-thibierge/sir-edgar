<?php

namespace App;

use Carbon\Carbon;
use Jenssegers\Mongodb\Eloquent\Model;
use Jenssegers\Mongodb\Relations\BelongsTo;

/**
 * @property mixed completed_at
 * @property mixed id
 */
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
        'user_id',
        'project_id',
        'completed_at',
        'today', // --> must be achieved today

        'start_time_tracker',
        'end_time_tracker',
        'due_date',
        'estimated_time',
        'time_spent',
        'priority',
        'notes'
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'routes',
        'is_completed'
    ];

    protected $dates = [
        'completed_at',
        'start_time_tracker',
        'end_time_tracker',
        'due_date',
    ];

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo {
        return $this->belongsTo('App\User');
    }

    public function project(): BelongsTo {
        return $this->belongsTo('App\Project');
    }

    public function getRoutesAttribute(): array {
        return [
            'store'     => route('goals.store'),
            'update'    => route('goals.update', ['goal' => $this]),
            'destroy'    => route('goals.destroy', ['goal' => $this]),
            'complete'    => route('goals.complete', ['goal' => $this]),
            'set_today'    => route('goals.set_today', ['goal' => $this]),
            'update_details'    => route('goals.details.update', ['goal' => $this]),
        ];
    }

    public function getIsCompletedAttribute(){
        return $this->completed_at != null;
    }

    public function setCompleted(){
        $this->completed_at = Carbon::now();
    }

}
