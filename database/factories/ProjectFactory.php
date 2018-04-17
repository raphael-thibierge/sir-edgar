<?php

use Faker\Generator as Faker;

$factory->define(App\Project::class, function (Faker $faker) {
    return [
        'title' => 'a project',
        'is_archived' => false,
    ];
});
