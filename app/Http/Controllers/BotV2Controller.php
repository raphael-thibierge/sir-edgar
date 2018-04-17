<?php

namespace App\Http\Controllers;

use App\Events\PusherDebugEvent;
use Illuminate\Http\Request;

class BotV2Controller extends Controller
{


    private static function getUserActionIntent(Request $request){
        return $request['queryResult']['action'];
    }

    public function dialogFlowEnterPoint(Request $request){

        // send request to pusher
        event(new PusherDebugEvent($request));





    }
}
