<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

/** @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(App\User::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'password' => $password ?: $password = bcrypt('secret'),
        'remember_token' => str_random(10),
        'timezone' => $faker->timezone,
        'daily_score_goal' => 5,
        'email_daily_report' => $faker->boolean,
        'email_weekly_report' => $faker->boolean,
        'morning_report' => $faker->boolean,
        'admin' => false,
    ];
});

$factory->state(App\User::class, 'admin', function ($faker) {
    return [
        'admin' => true,
    ];
});