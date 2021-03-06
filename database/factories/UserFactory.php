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

use Illuminate\Support\Str;

/** @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define('App\Models\User'::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'password' => $password ?: $password = bcrypt('secret'),
        'remember_token' => Str::random(10),
        'timezone' => $faker->timezone,
        'daily_score_goal' => 5,
        'email_daily_report' => $faker->boolean,
        'email_weekly_report' => $faker->boolean,
        'morning_report' => $faker->boolean,
        'admin' => false,
    ];
});

$factory->state('App\Models\User'::class, 'admin', function ($faker) {
    return [
        'admin' => true,
    ];
});