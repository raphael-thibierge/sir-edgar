<?php

use Carbon\Carbon;
use Faker\Generator as Faker;

$factory->define(App\FinancialTransaction::class, function (Faker $faker) {
    return [
        'title' => 'An expense',
        'price' => $faker->randomFloat(2, 0, 100),
        'date' => $faker->dateTime,
        'description' => $faker->text,
        'type' => 'expense',
        'currency' => 'CAD',
        'tags' => $faker->randomElements(['a', 'b', 'c', 'd'], 2)
    ];
});

$factory->state(App\FinancialTransaction::class, 'cigarettes', function (Faker $faker) {
    return [
        'title' => 'Cigarettes',
        'tags' => ['cigarettes'],
        'type' => 'expense'
    ];
});

$factory->state(App\FinancialTransaction::class, 'now', function (Faker $faker) {
    return [
        'date' => Carbon::now(),
    ];
});

$factory->state(App\FinancialTransaction::class, 'expense', function (Faker $faker) {
    return [
        'type' => 'expense',
    ];
});

$factory->state(App\FinancialTransaction::class, 'entrance', function (Faker $faker) {
    return [
        'type' => 'entrance',
    ];
});