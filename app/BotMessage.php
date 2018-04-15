<?php

namespace App;


use App\Events\PusherDebugEvent;
use function GuzzleHttp\default_ca_bundle;
use Illuminate\Http\Request;
use Jenssegers\Mongodb\Eloquent\Model;
use Jenssegers\Mongodb\Relations\BelongsTo;

/**
 * @property json request
 * @property User user
 * @property array response
 */
class BotMessage extends Model
{
    protected $collection = 'dialogflow_webhooks';

    protected $primaryKey = '_id';

    protected $fillable = ['request', 'user_id', 'response'];

    public static function createFromRequest(Request $request): BotMessage{

        // new bot message but will never be stored in database
        $message = new BotMessage([
            'request' => $request->toArray()
        ]);

        $message->associateUser();

        return $message;
    }

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo {
        return $this->belongsTo('App\User');
    }


    private function associateUser(){

        // associate user
        $user = null;
        switch ($this->getSource()){
            case 'google':
                $user = User::first();
                break;

            case 'facebook':
                $user = User::where('facebook_sending_id', $this->getFacebookSenderId())->first();
                if ($user == null){
                    $user = User::demoUser();
                }
                break;

            case 'telegram':
                $user = User::first();
                break;

            case 'web_demo':
                $user = User::demoUser();
                break;

            default:
                $user = User::demoUser();
                break;
        }

        $this->user()->associate($user);
    }

    public function getOriginalRequest(){
        return $this->request['originalDetectIntentRequest'];
    }

    public function getSource(){
        $originalIntentRequest = $this->getOriginalRequest();

        // facebook and google
        if (isset($originalIntentRequest['source']) && !empty(isset($originalIntentRequest['source']))) {
            return $originalIntentRequest['source'];
        }

        // telegram
        else if (isset($originalIntentRequest['payload']['source']) && !empty(isset($originalIntentRequest['payload']['source']))){
            return $originalIntentRequest['payload']['source'];
        }

        return 'web_demo';
    }

    public function getFacebookSender(){
        return $this->getOriginalRequest()['payload']['data']['sender'];
    }

    public function getFacebookSenderId(){
        return $this->getFacebookSender()['id'];
    }

    private function getResult(){
        return $this->request['queryResult'];
    }

    public function getAction(){
        return $this->getResult()['action'];
    }

    public function getParameter(string $parameter) {
        if (isset($this->getResult()['parameters'][$parameter])){
            return $this->getResult()['parameters'][$parameter];
        } else {
            return null;
        }
    }

    public function buildTextResponse(string $text){
        $this->response = [
            'fulfillmentText' => $text,
        ];
    }

    public function buildEventResponse(string $event, array $parameters = []){
        $this->response = $parameters === [] ? [
            "followupEventInput" => [
                "name" => $event,
                "languageCode" => "en"
            ]
        ] : [
            "followupEventInput" => [
                "name" => $event,
                "parameters" => $parameters,
                "languageCode" => "en"
            ]
        ];
    }

}
