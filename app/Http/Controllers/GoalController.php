<?php

namespace App\Http\Controllers;

use App\Events\GoalCreated;
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
        $this->middleware('auth', ['except' => 'reComplete']);
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
        $this->validate($request, [
            'title' => 'required',
            'score' => 'required|integer|max:5',
            'project_id' => 'required',
        ]);

        $goal = Auth::user()->goals()->create([
            "project_id" => $request->get('project_id'),
            "title" => $request->get('title'),
            "score" => (int)$request->get('score'),
        ]);

        event(new GoalCreated($goal));

        return $this->successResponse([
            'goal'  => $goal
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'title' => 'required',
            'score' => 'required|integer|max:5',
        ]);

        $goal =  Auth::user()->goals()->find($id)->update([
            "title" => $request->get('title'),
            "score" => (int)$request->get('score'),
        ]);

        return $this->successResponse([
            'goal'  => $goal
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
        $goal->delete();
        return $this->successResponse();
    }

    /**
     * Complete a goal
     *
     * @param Request $request
     * @param Goal $goal
     * @return \Illuminate\Http\JsonResponse
     */
    public function complete(Request $request, Goal $goal){

        $goal->setCompleted();
        $goal->update();
        return $this->successResponse();
    }


    public function goalScorePerDay(Request $request){

        $user = Auth::user();

        $offset = intval($request->has('offset') ? $request->get('offset') : 0);

        $data = Goal::raw(function ($collecton) use ($user, $offset){
            return $collecton->aggregate([
                [
                    '$match' => [
                        'completed_at' => [
                            '$exists' => 'true',
                            '$ne' => 'null'
                        ],
                        'user_id' => $user->id
                    ]
                ],
                [
                    '$group'=> [
                        '_id'=>  [
                            'day' => [ '$dayOfMonth' => [[ '$subtract' => [ '$completed_at', $offset ]]]],
                            'month' => ['$month'=> [[ '$subtract' => [ '$completed_at', $offset ]]]],
                            'year' => [ '$year' => [[ '$subtract' => [ '$completed_at', $offset ]]]]
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
            $json [$date] = $result->totalScore;
        }


        return $this->successResponse([
            'scores' => $json,
            'firstDate' => $user->created_at->toDateString(),
        ]);
    }


    public function todayScore(){
        $score = Auth::user()->goals()
            ->where('completed_at', '>', Carbon::yesterday())
            ->select('score')->get()
            ->sum('score');

        return $this->successResponse([
            'score' => $score
        ]);
    }

    public function reComplete(Goal $goal){

        if ($goal->getIsCompletedAttribute() == true){

            $goal->project->goals()->create([
                'title' => $goal->title,
                'score' => $goal->score,
                'user_id' => $goal->user_id,
                'completed_at' => Carbon::now()
            ]);

        } else {
            $goal->setCompleted();
            $goal->save();
        }

        return $this->successResponse();

    }



}
