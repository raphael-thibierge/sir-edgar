<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Jenssegers\Mongodb\Relations\HasMany;

/**
 * @property string name
 * @property string email
 * @property bool admin
 * @property mixed id
 * @property mixed timezone
 * @property int daily_score_goal
 * @property mixed projects
 * @property Collection budgets
 */
class   User extends \Jenssegers\Mongodb\Auth\User
{
    use Notifiable;


    const DEFAULT_ATTRIBUTES = [
        'admin' => false,
        'daily_score_goal' => 5,
        'timezone' => 'Europe/Paris',
        'email_daily_report' => false,
        'email_weekly_report' => false,
        'morning_report' => false,
    ];

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
        'facebook_sending_id',
        'morning_report',
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
     * New user creator, initiating default values
     *
     * @param array $attributes
     * @return User
     */
    public static function newUser(array $attributes = []): User
    {

        // set default attributes
        foreach (self::DEFAULT_ATTRIBUTES as $attributeName => $attributeValue){
            if (!isset($attributes[$attributeName]) || empty($attributes[$attributeName])){
                $attributes[$attributeName] = $attributeValue;
            }
        }

        return User::create($attributes);
    }


    /**
     * User's goals
     * @return HasMany
     */
    public function goals() : HasMany{
        return $this->hasMany('App\Goal');
    }

    /**
     * Goals ending today, depending from user's timezone
     *
     * @return HasMany
     */
    public function goalsEndingToday(): HasMany{
        return $this->goals()
            ->whereNull('completed_at')
            ->whereNotNull('due_date')
            ->where('due_date', '>=', Carbon::today($this->timezone))
            ->where('due_date', '<', Carbon::tomorrow($this->timezone));
    }

    /**
     * User's goals
     * @return HasMany
     */
    public function financialTransactions() : HasMany{
        return $this->hasMany('App\FinancialTransaction');
    }

    /**
     * Goals completed yesterday
     *
     * @return HasMany
     */
    public function yesterday_goals() : HasMany{
        return $this->goals()
            ->where('completed_at', '>=', Carbon::yesterday($this->timezone))
            ->where('completed_at', '<', Carbon::today($this->timezone));
    }

    /**
     * User's projects
     *
     * @return HasMany
     */
    public function projects() : HasMany{
        return $this->hasMany('App\Project');
    }

    public function budgets(): HasMany{
        return $this->hasMany('App\Budget');
    }

    public function expenses(): HasMany{
        return $this->financialTransactions()->where('type', FinancialTransaction::EXPENSE);
    }

    public function oAuthConnections(): HasMany{
        return $this->hasMany('App\OAuthConnection');
    }

    public function getOAuthConnection(string $service): ?OAuthConnection {
        return $this->oAuthConnections()->where('service', $service)->first();
    }

    /**
     * User's admin state
     *
     * @return bool
     */
    public function isAdmin(): bool {
        return $this->admin != null ? $this->admin : false;
    }

    /**
     * User's current score
     *
     * @return int
     */
    public function getCurrentScore(): int{
        $date = Carbon::today($this->timezone);

        return $this->goals()->where('completed_at', '>=', $date)->sum('score');
    }

    /**
     * User's intent score
     *
     * @param int $score
     */
    public function setDailyScoreGoal(int $score){
        $this->daily_score_goal = $score;
    }

    /**
     * User's progress percentage
     *
     * @return int
     */
    public function currentProgress(): int{
        return $this->getCurrentScore() / $this->daily_score_goal * 100;
    }

    /**
     * Search user's projects by name in database
     *
     * @param string $projectName
     * @return mixed
     * @internal param User $user
     * @internal param string $projecName
     */
    public function searchUserProjectsByName(string $projectName): HasMany{

        $projectNameLowerCase = strtolower($projectName);
        $projectNameFirstUpperCase = ucfirst($projectName);

        return $this->projects()
            ->whereIn('title', [$projectNameLowerCase, $projectNameFirstUpperCase]);
    }

    /**
     * Search user's goals by name in database
     *
     * @param string $goalName
     * @return mixed
     * @internal param User $user
     * @internal param string $projecName
     */
    public function searchUserGoalsByName(string $goalName): HasMany{

        $projectNameLowerCase = strtolower($goalName);
        $projectNameFirstUpperCase = ucfirst($goalName);

        return $this->goals()
            ->whereIn('title', [$projectNameLowerCase, $projectNameFirstUpperCase]);
    }


    public function allBudgetsToStringWithEOL(){
        $string = "";
        foreach ($this->budgets as $budget){
            $string .= $budget->toString() . PHP_EOL;
        }
        return $string;
    }

    public function endingTodayGoalsToStringWithEOL(){
        $string = "";
        foreach ($this->goalsEndingToday()->get() as $goal){
            $string .= $goal->toString() . PHP_EOL;
        }
        return $string;
    }

    public function importantGoalsToStringWithEOL(){
        $string = "";
        foreach ($this->goals()->whereNull('completed_at')->where('today', true)->get() as $goal){
            $string .= $goal->toString() . PHP_EOL;
        }
        return $string;
    }

    public function getTotalCurrentMonthExpensesAttribute(){
        return $this->expenses()
            ->where('created_at', '>=' , Carbon::now($this->timezone)->startOfMonth())
            ->sum('price');
    }

    public function getTotalCurrentWeekExpensesAttribute(){
        return $this->expenses()
            ->where('created_at', '>=' , Carbon::now($this->timezone)->startOfWeek())
            ->sum('price');
    }

    public function hasMessenger(): bool {
        return isset($this->facebook_sending_id) && !empty($this->facebook_sending_id) && $this->facebook_sending_id !== null;
    }

}
