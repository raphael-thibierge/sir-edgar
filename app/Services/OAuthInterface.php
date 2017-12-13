<?php
/**
 * Created by PhpStorm.
 * User: raphael
 * Date: 16/11/2017
 * Time: 10:30
 */

namespace App\Services;


interface OAuthInterface
{

    public function getAuthUrl();

    public function getTokenUrl();

}