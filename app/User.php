<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Jenssegers\Mongodb\Relations\HasMany;

class User extends \Jenssegers\Mongodb\Auth\User
{
    use Notifiable;




    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function goals() : HasMany{
        return $this->hasMany('App\Goal', 'accomplished_by_id', '_id');
    }
}
