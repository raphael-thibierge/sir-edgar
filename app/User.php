<?php

namespace App;

use Carbon\Carbon;
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
        'name',
        'email',
        'password',
        'admin',
        'daily_score_goal',
        'timezone',
        'email_daily_report',
        'email_weekly_report',
        'facebook_sending_id'
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

    /**
     * User's goals
     * @return HasMany
     */
    public function financialTransactions() : HasMany{
        return $this->hasMany('App\FinancialTransaction');
    }

    public function yesterday_goals() : HasMany{
        return $this->goals()
            ->where('completed_at', '>=', Carbon::yesterday($this->timezone))
            ->where('completed_at', '<', Carbon::today($this->timezone));
    }

    public function projects() : HasMany{
        return $this->hasMany('App\Project');
    }

    public function isAdmin(): bool {
        return $this->admin != null ? $this->admin : false;
    }

}
