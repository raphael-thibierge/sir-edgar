<?php

namespace App;


use Jenssegers\Mongodb\Eloquent\Model;
use Jenssegers\Mongodb\Relations\BelongsTo;
use Jenssegers\Mongodb\Relations\HasMany;
use Laravel\Scout\Searchable;

/**
 * @property string user_id
 * @property mixed is_archived
 */
class Project extends Model
{
    use Searchable;

    protected $connection = 'mongodb';

    /**
     * @var string
     */
    protected $collection = 'projects';

    /**
     * @var string
     */
    protected $primaryKey = '_id';

    /**
     * @var array
     */
    protected $fillable = [
        'title',
        'is_archived',
        'user_id'
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'routes',
    ];

    public function getRoutesAttribute(): array {
        return [
            'store'     => route('projects.store'),
            'update'    => route('projects.update', ['project' => $this]),
        ];
    }

    /**
     * Project's user
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo {
        return $this->belongsTo('App\User');
    }


    /**
     * Project's goals
     *
     * @return HasMany
     */
    public function goals(): HasMany {
        return $this->hasMany('App\Goal');
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        $array = $this->toArray();
        unset($array['routes']);
        return $array;
    }
}
