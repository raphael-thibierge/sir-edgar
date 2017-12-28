<?php

namespace App\Http\Controllers;

use App\User;
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
            'user'=> User::with('oAuthConnections')->find(Auth::user()->id),
            'pusher' => [
                'key' => config('broadcasting.connections.pusher.key'),
                'cluster' => config('broadcasting.connections.pusher.options.cluster'),
            ]
        ]);
    }
}
