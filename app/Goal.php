<?php

namespace App;

use App\Events\GoalCompleted;
use Carbon\Carbon;
use Jenssegers\Mongodb\Eloquent\Model;
use Jenssegers\Mongodb\Query\Builder;
use Jenssegers\Mongodb\Relations\BelongsTo;

/**
 * @property Carbon completed_at
 * @property string id
 * @property int priority
 * @property Carbon due_date
 * @property string title
 * @property Project project
 * @property int score
 * @property User user
 */
class Goal extends Model
{
    const TYPE_GOAL = 'goal';
    const TYPE_NOTE = 'note';
    const TYPE_REMINDER = 'reminder';
    const TYPE_DEFAULT = Goal::TYPE_GOAL;

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
        'type',
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

    public function setCompletedAndSave(){
        $this->completed_at = Carbon::now();
        $this->save();
        broadcast(new GoalCompleted($this));
    }


    public static function searchByTitle(string $title): Builder{
        return Goal::where('title', 'like', $title);
    }

    public function toString(){
        return $this->title . "($this->score) ";
    }

}
