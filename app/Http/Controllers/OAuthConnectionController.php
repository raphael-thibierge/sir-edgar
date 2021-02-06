<?php

namespace App\Http\Controllers;

use App\Http\OAuthServices\OAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OAuthConnectionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /*
    private function getOAuthService(string $service): OAuthService{
        // TODO: manage service manager
        //return new OAuthService(Auth::user());
        return null;
    }

    public function oAuthAuthorize(string $service){

        $oauthService = $this->getOAuthService($service);

        if ($oauthService->isAlreadyLinked()){
            die('Account is already linked');
        }

        return redirect($oauthService->getAuthorizationUrl());
    }

    public function oAuthAuthorizeCallback(Request $request, string $service){

        $oAuthService = $this->getOAuthService($service);

        return $oAuthService->createOAuthConnection($request) ?
            view('oauth_connections.success') : view('oauth_connections.error');
    }
    */
}
