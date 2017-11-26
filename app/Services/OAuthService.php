<?php
/**
 * Created by PhpStorm.
 * User: raphael
 * Date: 17/11/2017
 * Time: 17:22
 */

namespace App\Services;


abstract class OAuthService
{

    protected $authorize_url;

    protected $token_url;

    protected $service;

    protected $scopes = [];

    protected $options = [];

    /**
     * @return string
     */
    public function getAuthUrl()
    {

        $client_id = config("services.$this->service.key");
        $redirectURI= 'https://www.sir-edgar.com/oauth/redirect/' . $this->service;

        $parameters = array_merge($this->options, [
            'client_id' => $client_id,
            'redirect_uri' => $redirectURI,
            'response_type' => 'code',
            'scope' => implode(',', $this->scopes),
            //'show_dialog' => !empty($options['show_dialog']) ? 'true' : null,
            //'state' => $options['state'] ?? null,
        ]);

        return $this->authorize_url . '?' . http_build_query($parameters);
    }

    public abstract function getAccessTocken();


}