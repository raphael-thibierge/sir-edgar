<?php

namespace App\Http\Controllers;

use App\Mail\DailyGoalsReportMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     */
    public function __construct()
    {
        $this->middleware('auth', ['only' => ['index']]);
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('home');
    }


    public function about(){
        return view('about');
    }

    public function privacyPolicy(){
        return view('policy');
    }

    public function test(){

        $user = Auth::user();

        Mail::to($user)->send(new DailyGoalsReportMail($user, 7));
        return 'ok';
    }
}
