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

    public function finance(){
        return view('finance');
    }

    public function financialData(){
        $user = Auth::user();
        $budgets = $user->budgets;
        $expenses = $user->expenses;
        return $this->successResponse([
            'expenses' => $expenses,
            'budgets' => $budgets,
        ]);
    }

    public function initialAppRequest(){
        return $this->successResponse([
            'user'=> Auth::user(),
            'pusher' => [
                'key' => config('broadcasting.connections.pusher.key'),
                'cluster' => config('broadcasting.connections.pusher.options.cluster'),
            ]
        ]);
    }
}
