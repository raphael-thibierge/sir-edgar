<?php

namespace App;


use Illuminate\Http\Request;
use Jenssegers\Mongodb\Eloquent\Model;
use Jenssegers\Mongodb\Relations\BelongsTo;

/**
 * @property json request
 */
class DialogflowWebhook extends Model
{
    protected $collection = 'dialogflow_webhooks';

    protected $primaryKey = '_id';

    protected $fillable = ['request', 'user_id'];


    public static function createFromRequest(Request $request): DialogflowWebhook{

        $webhook = DialogflowWebhook::create([
            'request' => $request->toArray()
        ]);

        $senderId = $webhook->getSender()['id'];

        $user = User::where('facebook_sending_id', $senderId)->first();

        if ($user === null){
            $user = User::newUser([
                'facebook_sending_id' => $senderId
            ]);
        }

        $webhook->user()->associate($user);

        return $webhook;
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

    public function findParameter(string $parameter) {
        if (isset($this->getResult()['parameters'][$parameter])){
            return $this->getResult()['parameters'][$parameter];
        } else {
            return null;
        }
    }

}
