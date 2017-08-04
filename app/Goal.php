<?php

namespace App;

use Carbon\Carbon;
use Jenssegers\Mongodb\Eloquent\Model;
use Jenssegers\Mongodb\Relations\BelongsTo;

/**
 * @property mixed completed_at
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
        'completed_at'
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
        'completed_at'
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
        ];
    }

    public function getIsCompletedAttribute(){
        return $this->completed_at != null;
    }

    public function setCompleted(){
        $this->completed_at = Carbon::now()
            // todo -- change this shit ! used for timezone diff (Paris = UTC+2, mongodb always use UTC)
            ->addHour(2);
    }

}
