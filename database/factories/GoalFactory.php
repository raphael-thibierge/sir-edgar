<?php

use Faker\Generator as Faker;

$factory->define(App\Goal::class, function (Faker $faker) {
    return [
        'title' => 'a goal',
        'score' => 1,
        'tags' => [],
        'today' => false, // --> must be achieved today
        'type' => \App\Goal::TYPE_GOAL,
    ];
});
