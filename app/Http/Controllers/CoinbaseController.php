<?php

namespace App\Http\Controllers;

use App\Http\OAuthServices\CoinbaseOAuthService;
use App\Services\CoinbaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CoinbaseController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }


    public function basicStats(){
        $service = new CoinbaseOAuthService(Auth::user());

        if ($service->isAlreadyLinked()){
            CoinbaseService::consoleDisplay($service->getApiClient(), false);
        } else {
            return redirect()->route('oauth.authorize', ['service' => 'coinbase']);
        }
    }
}
