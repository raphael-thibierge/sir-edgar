<?php

namespace App\Http\Controllers;

use App\Goal;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GoalController extends Controller
{
    /**
     * GoalController constructor.
     */
    public function __construct()
    {
        $this->middleware('auth');
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
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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
        ]);

        $user = Auth::user();

        $goal = $user->goals()->create([
            "title" => $request->get('title'),
            "score" => (int)$request->get('score'),
        ]);


        return $this->successResponse([
            'goal'  => $goal
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        //
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


    public function goalScorePerDay(){

        $user = Auth::user();

        $data = Goal::raw(function ($collecton) use ($user){
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
                            'day' => [ '$dayOfMonth' => '$completed_at'],
                            'month' => ['$month'=> '$completed_at'],
                            'year' => [ '$year' => '$completed_at']
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

}
