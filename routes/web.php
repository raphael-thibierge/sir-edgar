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

Route::resource('goals', 'GoalController');
Route::prefix('goals')->group(function (){
    Route::post('{goal}/complete', 'GoalController@complete')->name('goals.complete');
});

Route::resource('users', 'UserController');