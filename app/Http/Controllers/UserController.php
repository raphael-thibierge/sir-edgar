<?php

namespace App\Http\Controllers;

use App\Goal;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{

    /**
     * UserController constructor.
     */
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('admin')->only(['index', 'destroy']);

    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all();

        $activeUsers =
            Goal::whereNotNull('completed_at')
                ->where('completed_at', '>=', Carbon::now()->subDays(15))
                ->groupBy('user_id')
                ->orderBy('user_id')
                ->pluck('user_id')
                ->count();

        return view('auth.index', [
            "users" => $users,
            "activeUsers" => $activeUsers
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

    }

    public function updateDailyScoreGoal(Request $request){

        $user = Auth::user();

        $user->setDailyScoreGoal((int)$request->get('daily_score_goal'));
        $user->update();

        return $this->successResponse();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index');
    }
}
