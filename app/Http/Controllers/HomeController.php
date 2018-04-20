<?php

namespace App\Http\Controllers;

use App\FinancialTransaction;
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
