<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
Route::get('/about', 'HomeController@about')->name('about');
Route::get('/test', 'HomeController@test')->name('test');

Route::match(['get', 'post'], '/botman', 'BotManController@handle');

Route::prefix('goals')->group(function (){
    Route::post('{goal}/complete', 'GoalController@complete')->name('goals.complete');
    Route::patch('{goal}/update-details', 'GoalController@updateDetails')->name('goals.details.update');
    Route::post('{goal}/set-today', 'GoalController@setToday')->name('goals.set_today');
    Route::post('{goal}/re-complete', 'GoalController@reComplete')->name('goals.re-complete');
    Route::get('score', 'GoalController@goalScorePerDay')->name('goals.score-per-day');
    Route::get('current-score', 'GoalController@currentScore')->name('goals.current-score');
});
Route::resource('goals', 'GoalController', ['except' => ['create', 'edit']]);

Route::prefix('user')->group(function (){
    Route::post('update-daily-score-goal', 'UserController@updateDailyScoreGoal')->name('goals.daily-score-goal.update');
});
Route::resource('users', 'UserController', ['only' => ['index', 'destroy']]);

Route::resource('projects', 'ProjectController', ['only' => ['index', 'store']]);

Route::match(['get', 'post'], '/botman', 'BotManController@handle')->middleware('botman');