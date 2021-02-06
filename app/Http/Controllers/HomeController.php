<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\FinancialTransaction;
use App\Models\User;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('auth');
        $this->middleware('auth', ['only' => ['index', 'initialAppRequest']]);
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('home');
    }

    public function initialAppRequest(){
        return $this->successResponse([
            'user'=> User::find(Auth::user()->id),
            'pusher' => [
                'key' => config('broadcasting.connections.pusher.key'),
                'cluster' => config('broadcasting.connections.pusher.options.cluster'),
                ]
            ]);
    }

    public function linkedTags($initialTag){
        $linkedTags = FinancialTransaction::whereRaw(['tags' => $initialTag])->pluck('tags')->collapse()->unique();

        $linkedTagsWithWeigth = [];

        foreach ($linkedTags as $tag){
            if ($tag !== $initialTag)
            $linkedTagsWithWeigth[$tag] = FinancialTransaction::whereRaw(['tags' => $tag])->count();
        }
        return $linkedTagsWithWeigth;
    }
}

