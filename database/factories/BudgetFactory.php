<?php

use App\Budget;
use Faker\Generator as Faker;

$factory->define(Budget::class, function (Faker $faker) {
    return [
        'name' => 'a budget',
        'period' => $faker->randomElement([Budget::PERIOD_WEEK, Budget::PERIOD_MONTHS]),
        'amount' => $faker->randomNumber(),
        'currency' => 'CAD',
        'tags' => [],
        'user_id' => null
    ];
});

$factory->state(App\Budget::class, 'week', function (Faker $faker) {
    return [
        'period' => Budget::PERIOD_WEEK,
    ];
});

$factory->state(App\Budget::class, 'month', function (Faker $faker) {
    return [
        'period' => Budget::PERIOD_MONTHS,
    ];
});