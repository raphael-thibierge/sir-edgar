<?php
/**
 * Created by PhpStorm.
 * User: raphael
 * Date: 09/12/2017
 * Time: 23:02
 */

namespace App\Http\OAuthServices;


use App\OAuthConnection;
use App\User;
use Illuminate\Http\Request;

/**
 */
abstract class OAuthService
{

    const SESSION_KEY = 'oauth2state';

    /**
     * @var string
     */
    public $service;

    /**
     * @var string
     */
    protected $authorization_url;

    /**
     * @var string
     */
    protected $access_token_url;

    /**
     * @var string
     */
    protected $resource_owner_url;

    /**
     * @var string
     */
    protected $redirect_uri;

    /**
     * @var array
     */
    protected $scopes;

    /**
     * @var User
     */
    protected $user;

    /**
     * @var OAuthConnection
     */
    protected $oAuthConnection;


    public function __construct(User $user)
    {
        $this->user = $user;
        $this->oAuthConnection = $user->oAuthConnections()->where('service', $this->service)->first();
    }

    public function isAlreadyLinked(): bool
    {
        return $this->oAuthConnection !== null;
    }

    protected function getKey(): string {
        return config("services.$this->service.key");
    }

    protected function getSecret(): string {
        return config("services.$this->service.secret");
    }

    public abstract function getAccessToken(): ?string ;

    public abstract function getRefreshToken(): ?string ;

    public abstract function getAuthorizationUrl(): string;

    public abstract function refreshToken(): void;

    public abstract function createOAuthConnection(Request $request): bool;

}