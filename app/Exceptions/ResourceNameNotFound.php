<?php
/**
 * Created by PhpStorm.
 * User: raphael
 * Date: 15/10/2017
 * Time: 02:23
 */

namespace App\Exceptions;


use Symfony\Component\Translation\Exception\NotFoundResourceException;
use Throwable;

class ResourceNameNotFound extends NotFoundResourceException
{

    /**
     * @var string
     */
    protected $projectName;

    protected $resourceName;

    public function __construct(string $resourceName, string $projectName, Throwable $previous = null)
    {
        $message = "$resourceName name attribute \"$projectName\" not found";
        $code = 0;

        $this->projectName = $projectName;

        $this->resourceName = $resourceName;

        parent::__construct($message, $code, $previous);
    }

}