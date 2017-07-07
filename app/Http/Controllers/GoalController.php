<?php

namespace App\Http\Controllers;

use App\Goal;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GoalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $goals = Goal::all();

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

        $user = User::first();

        $goal = $user->goals()->create([
            "title" => $request->get('title'),
            "score" => $request->get('score'),
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
}
