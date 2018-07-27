<?php

namespace App\Http\Controllers;

use App\Events\GoalCreated;
use App\Events\GoalDeleted;
use App\Events\PusherDebugEvent;
use App\Goal;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GoalController extends Controller
{
    /**
     * GoalController constructor.
     */
    public function __construct()
    {
        $this->middleware('auth', ['except' => 'reComplete', 'complete']);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $goals = Auth::user()->goals;

        return $this->successResponse([
            'goals' => $goals,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //$this->authorize('create', Goal::class);

        $this->validate($request, [
            'title' => 'required',
            'score' => 'required|integer|max:5',
            'project_id' => 'required|exists:mongodb.projects,_id',
            'today' => 'required|bool',
        ]);

        $goal = Auth::user()->goals()->create([
            "project_id" => $request->get('project_id'),
            "title" => $request->get('title'),
            "score" => (int)$request->get('score'),
            "today" => (bool)$request->get('today'),
        ]);

        return $this->successResponse([
            'goal'  => $goal
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param Goal $goal
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function update(Request $request, Goal $goal)
    {
        $this->authorize('update', $goal);

        $this->validate($request, [
            'due_date' => 'present',
        ]);

        $updates = [];

        if (($score = $request->get('score')) !== null){
            $updates ['score'] = (int)$score;
        }

        if (($due_date = $request->get('due_date')) !== null){
            $updates ['due_date'] = new Carbon($due_date);
        } else {
            $updates ['due_date'] = null;
        }

        if (($completed_at = $request->get('completed_at')) !== null){
            $updates ['completed_at'] = new Carbon($completed_at);
        } else {
            $updates ['completed_at'] = null;
        }

        if (($title = $request->get('title')) !== null){
            $updates ['title'] = $title;
        }

        if (($estimated_time = $request->get('estimated_time')) !== null){
            $updates ['estimated_time'] = (int)$estimated_time;
        }

        if (($time_spent = $request->get('time_spent')) !== null){
            $updates ['time_spent'] = (int)$time_spent;
        }

        if (($priority = $request->get('priority')) !== null){
            $updates ['priority'] = (int)$priority;
        }

        if (($notes = $request->get('notes')) !== null){
            $updates ['notes'] = $notes;
        }

        if (($today = $request->get('today')) !== null){
            $updates ['today'] = (bool)$today;
        }

        $goal->update($updates);

        return $this->successResponse([
            'goal'  => $goal,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Goal $goal
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function destroy(Goal $goal)
    {
        $this->authorize($goal);
        $goal->delete();
        return $this->successResponse();
    }

    /**
     * Complete a goal
     *
     * @param Goal $goal
     * @return \Illuminate\Http\JsonResponse
     */
    public function complete(Goal $goal){
        $this->authorize('update', $goal);
        $goal->setCompletedAndSave();
        return $this->successResponse([
            'goal' => $goal
        ]);
    }


    public function goalScorePerDay(Request $request){

        $user = Auth::user();

        // offset in minute
        $offset = intval($request->has('offset') ? $request->get('offset') : 0);
        // put offset in milliseconds
        $offset *= 60 * 1000;

        $data = Goal::raw(function ($collection) use ($user, $offset){
            return $collection->aggregate([
                [
                    '$match' => [
                        'completed_at' => [
                            '$exists' => 'true',
                            '$ne' => null
                        ],
                        'user_id' => $user->id
                    ]
                ],
                [
                    '$group'=> [
                        '_id'=>  [
                            'day' => [ '$dayOfMonth' => [[ '$subtract' => [ '$completed_at', $offset ]]]],
                            'month' => ['$month'=> [[ '$subtract' => [ '$completed_at', $offset ]]]],
                            'year' => [ '$year' => [[ '$subtract' => [ '$completed_at', $offset ]]]],
                            'project' => '$project_id'
                        ],
                        'totalScore' => ['$sum'=> '$score']
                    ]
                ]
            ]);
        });



        $json = [];
        foreach ($data as $result){

            $date = Carbon::create($result->_id->year, $result->_id->month, $result->_id->day)
                ->toDateString();
            $json[$date][$result->_id->project] = $result->totalScore;
        }

        $projects = $user->projects()->select('_id', 'title')->pluck('title', '_id');


        return $this->successResponse([
            'scores' => $json,
            'projects' => $projects,
            'firstDate' => $user->created_at->toDateString(),
        ]);
    }

    public function reComplete(Goal $goal){
        $this->authorize('update', $goal);

        if ($goal->getIsCompletedAttribute() == true){

            $goal->project->goals()->create([
                'title' => $goal->title,
                'score' => $goal->score,
                'user_id' => $goal->user_id,
                'completed_at' => Carbon::now()
            ]);

        } else {
            $goal->setCompletedAndSave();
        }

        return $this->successResponse();

    }

    public function setToday(Request $request, Goal $goal){
        $this->authorize('update', $goal);

        $this->validate($request, [
            'today' => 'required|bool'
        ]);

        // request's input today is a string
        $today = (bool)$request->input('today');

        $goal->update(['today' => $today]);

        return $this->successResponse([
            'goal' => $goal,
            'today' => $today,
        ]);

    }

    public function currentScore(){
        $user = Auth::user();

        $score = $user->getCurrentScore();

        return $this->successResponse([
            'score' => $score,
            'daily_score_goal' => $user->daily_score_goal,
        ]);
    }

    public function todayScore(){

        $user = Auth::user();

        $score = $user->goals()
            ->where('completed_at', '>=', Carbon::yesterday($user->timezone))
            ->select('score')->get()
            ->sum('score');

        return $this->successResponse([
            'score' => $score
        ]);
    }

    public function completedStats(){
        $user = Auth::user();

        $oneWeekAgo = Carbon::today($user->timezone)->subWeeks(1);
        $oneMonthAgo = Carbon::today($user->timezone)->subMonths(1);
        $today = Carbon::today($user->timezone);

        $total = $user->completedGoals();
        $thisDay = $user->goals()->where('completed_at', '>=', $today);
        $thisWeek = $user->goals()->where('completed_at', '>=', $oneWeekAgo);
        $thisMonth = $user->goals()->where('completed_at', '>=', $oneMonthAgo);
        $todo = $user->goals()->whereNull('completed_at');


        return $this->successResponse([
            'goals' => [
                'today' => $thisDay->count(),
                'total' => $total->count(),
                'week' => $thisWeek->count(),
                'month' => $thisMonth->count(),
                'todo' => $todo->count()
            ],
            'score' => [
                'today' => $thisDay->sum('score'),
                'total' => $total->sum('score'),
                'week' => $thisWeek->sum('score'),
                'month' => $thisMonth->sum('score'),
                'todo' => $todo->sum('score')
            ]
        ]);
    }

}
