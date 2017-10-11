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
Route::get('/app/load', 'HomeController@initialAppRequest')->name('app.load');
Route::get('/about', 'HomeController@about')->name('about');
Route::get('/privacy-policy', 'HomeController@privacyPolicy')->name('privacy.policy ');

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

Route::resource('projects', 'ProjectController', ['only' => ['index', 'store', 'update']]);

Route::match(['get', 'post'], '/botman', 'BotManController@handle')->middleware('botman');
Route::match(['get', 'post'], '/botman/authorize', 'BotManController@showMessengerLoginForm')->middleware('botman')->name('botman.authorize');
Route::post('/botman/authorize', 'BotManController@authorizePost')->middleware('botman')->name('botman.authorize.post');
Route::post('/botman/confirm', 'BotManController@confirm')->middleware('botman')->name('botman.confirm');
Route::get('/botman/confirm', 'BotManController@showConfirm')->middleware('botman')->name('botman.confirm.show');


Route::post('/dialogflow/webhook', 'DialogflowController@dialogflow')->middleware('botman')->name('doalogflow');
