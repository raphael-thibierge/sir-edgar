<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Jenssegers\Mongodb\Relations\HasMany;

/**
 * @property string name
 * @property string email
 * @property bool admin
 */
class User extends \Jenssegers\Mongodb\Auth\User
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'admin'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * User's goals
     * @return HasMany
     */
    public function goals() : HasMany{
        return $this->hasMany('App\Goal');
    }

    public function isAdmin(): bool {
        return $this->admin != null ? $this->admin : false;
    }

}
