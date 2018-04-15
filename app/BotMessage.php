<?php

namespace App;


use App\Events\PusherDebugEvent;
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

        //return $message;
        $senderId = $message->getSender()['id'];

        $user = User::where('facebook_sending_id', $senderId)->first();

        if ($user === null){
            $user = User::newUser([
                'facebook_sending_id' => $senderId
            ]);
        }

        $message->user()->associate($user);

        return $message;
    }

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo {
        return $this->belongsTo('App\User');
    }

    public function getOriginalRequest(){
        return $this->request['originalDetectIntentRequest'];
    }

    public function getSource(){
        return $this->getOriginalRequest()['source'];
    }

    public function getSender(){
        return $this->getOriginalRequest()['payload']['sender'];
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
