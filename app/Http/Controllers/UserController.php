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
     *
     *
     * @param Request $request
     * @return mixed
     */
    public function getApiUser(Request $request){
        return $request->user();
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

    public function accountSettingsUpdate(Request $request){
        $this->validate($request, [
            'timezone' => 'required|string',
            'email_daily_report' => 'required',
            'email_weekly_report' => 'required',
        ]);

        $user = Auth::user();

        $user->update([
                'timezone' => $request->get('timezone'),
                'email_daily_report' => (bool)$request->get('email_daily_report'),
                'email_weekly_report' => (bool)$request->get('email_weekly_report'),
        ]);

        return $this->successResponse([
            'user' => $user,
            'timezone' => $request->get('timezone'),
            'sd' => (bool)$request->get('email_daily_report')
        ]);

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
