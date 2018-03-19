<?php

namespace App;


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
        return $this->request['originalRequest'];
    }

    public function getSource(){
        return $this->getOriginalRequest()['source'];
    }

    public function getSender(){
        return $this->getOriginalRequest()['data']['sender'];
    }

    private function getResult(){
        return $this->request['result'];
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
            'speech' => $text,
            'displayText' => $text,
        ];
    }

    public function buildEventResponse(string $event, array $parameters = []){
        $this->response = $parameters === [] ? [
            "followupEvent" => [
                "name" => $event,
            ]
        ] : [
            "followupEvent" => [
                "name" => $event,
                "data" => $parameters
            ]
        ];
    }

}
