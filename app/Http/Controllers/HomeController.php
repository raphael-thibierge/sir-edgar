<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     */
    public function __construct()
    {
        $this->middleware('auth', ['only' => ['index', 'initialAppRequest']]);
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

    public function initialAppRequest(){
        return $this->successResponse([
            'user'=> Auth::user(),
            'pusher' => [
                'key' => env('PUSHER_APP_KEY'),
                'cluster' => env('PUSHER_CLUSTER'),
            ]
        ]);
    }
}
