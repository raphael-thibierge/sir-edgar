<?php

namespace App\Http\Controllers;

use App\Events\PusherDebugEvent;
use App\User;
use Illuminate\Http\Request;

class DialogflowController extends Controller
{

    /**
     * @var Request
     */
    private $request;

    /**
     * @var User
     */
    private $userInDB;


    private function getAction(){
        return $this->request->get('result')['action'];
    }

    private function getFacebookSenderId(){
        return $this->request->get('originalRequest')['data']['sender']['id'];
    }

    private function getOriginalRequestProvider(){
        return $this->request->get('originalRequest')['source'];
    }

    private function getUserFromFacebook(){
        $this->userInDB = User::where('facebook_sending_id', $this->getFacebookSenderId())->first();
    }


    private function findProject(){
        $projectName = $this->request->get('result')['parameters']['Project'];

        event(new PusherDebugEvent([
            'method' => 'DialogflowController@dialogflow5',
            'user' => $this->userInDB,
            'project' => $this->userInDB->projects,

        ]));
        return $this->userInDB->projects()->where('title', $projectName)->first();

    }

    public function dialogflow(Request $request){
        $this->request = $request;
        event(new PusherDebugEvent([
            'method' => 'DialogflowController@dialogflow1',
            'request' => $request->toArray(),
        ]));


        $this->getUserFromFacebook();



        if ($this->userInDB === null){
            return response()->json([
                'speech' => 'User not found',
                'displayText' => 'User not found',
            ]);
        }

        $responseData = null;

        switch ($this->getAction()){

            case 'show_project_action':


                event(new PusherDebugEvent([
                    'method' => 'DialogflowController@dialogflow3',

                ]));

                $project = $this->findProject();

                event(new PusherDebugEvent([
                    'method' => 'DialogflowController@dialogflow5',
                    'project' => $project,

                ]));
                if ($project === null) {
                    $responseData = [
                        'speech' => 'Project not found',
                        'displayText' => 'Project not found',
                    ];
                } else {


                    $responseData = [
                        "followupEvent" => [
                            "name" => "goals_in_project",
                            "data" => [
                                'Project' => $project->title,
                                'nbGoals' => (string)$project->goals()->count(),
                            ]
                        ]
                    ];
                }

                break;


            default:
                $responseData = [
                    'speech' => 'action not understood',
                    'displayText' => 'action not understood',
                ];
                break;
        }


        $response =  response()->json($responseData);

        return $response;
    }
}
