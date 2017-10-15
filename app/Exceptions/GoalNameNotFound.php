<?php
/**
 * Created by PhpStorm.
 * User: raphael
 * Date: 15/10/2017
 * Time: 02:30
 */

namespace App\Exceptions;


class GoalNameNotFound extends ResourceNameNotFound
{
    /**
     * ProjectNameNotFound constructor.
     * @param string $projectName
     */
    public function __construct(string $projectName)
    {
        parent::__construct("\App\Goal", $projectName);
    }

    public function getNiceMessage(): string {
        return "Goal \"$this->projectName\" not found...";
    }
}