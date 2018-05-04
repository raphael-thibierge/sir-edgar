<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loading by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::view('/', 'welcome');

Auth::routes();

Route::view('home', 'home')->name('home')->middleware('auth');
Route::view('privacy-policy', 'policy')->name('privacy.policy ');
Route::view('about', 'about')->name('about');

Route::get('app/load', 'HomeController@initialAppRequest')->name('app.load');

Route::match(['get', 'post'], '/botman', 'BotManController@handle');

Route::prefix('goals')->group(function (){
    Route::post('{goal}/complete', 'GoalController@complete')->name('goals.complete');
    Route::patch('{goal}/update-details', 'GoalController@updateDetails')->name('goals.details.update');
    Route::post('{goal}/set-today', 'GoalController@setToday')->name('goals.set_today');
    Route::post('{goal}/re-complete', 'GoalController@reComplete')->name('goals.re-complete');
    Route::get('score', 'GoalController@goalScorePerDay')->name('goals.score-per-day');
    Route::get('current-score', 'GoalController@currentScore')->name('goals.current-score');
    Route::get('completed/stats', 'GoalController@completedStats')->name('goals.completed.stats');
});


Route::prefix('user')->group(function (){
    Route::post('update-daily-score-goal', 'UserController@updateDailyScoreGoal')->name('goals.daily-score-goal.update');
});


Route::match(['get', 'post'], '/botman', 'BotManController@handle')->middleware('botman');
Route::match(['get', 'post'], '/botman/authorize', 'BotManController@showMessengerLoginForm')->middleware('botman')->name('botman.authorize');
Route::post('/botman/authorize', 'BotManController@authorizePost')->middleware('botman')->name('botman.authorize.post');
Route::post('/botman/confirm', 'BotManController@confirm')->middleware('botman')->name('botman.confirm');
Route::get('/botman/confirm', 'BotManController@showConfirm')->middleware('botman')->name('botman.confirm.show');


Route::post('/dialogflow/webhook', 'BotController@dialogflow')->middleware('botman')->name('doalogflow');
Route::get('/dialogflow/messenger/{senderId}/authorize', 'BotController@messengerAuthorizePost')->name('dialogflow.authorize.messenger.post');


Route::get('/bot/requests', 'BotController@index')->name('dailogflow.webhooks.index');
Route::get('/bot/requests/{botMessage}/', 'BotController@show')->name('dailogflow.webhooks.show');
//Route::get('/dialogflow/webhooks/{webhook}', 'DialogflowController@show')->name('dailogflow.webhooks.show');

    
Route::view('finance', 'finance')->middleware('auth')->name('finance');


Route::get('money-values/24h/{currency}', 'MoneyValueController@twentyFourHourValues')
    ->name('money_values.24h')
    ->middleware('auth');


Route::prefix('oauth/{service}/')->group(function (){
    Route::get('authorize', 'OAuthConnectionController@oAuthAuthorize')->name('oauth.authorize');
    Route::get('callback', 'OAuthConnectionController@oAuthAuthorizeCallback')->name('oauth.callback');
});

Route::get('coinbase', 'CoinbaseController@basicStats');

Route::view('account', 'user')->name('account');
Route::post('account/update', 'UserController@accountSettingsUpdate')->name('account.update')->middleware('auth');

Route::get('financial-transactions/download', 'FinancialTransactionController@download')->middleware('auth');
Route::get('budget/download', 'FinancialTransactionController@download')->middleware('auth');

Route::apiResources([
    'users' => 'UserController',
    'projects' => 'ProjectController',
    'goals' => 'GoalController',
    'budgets' => 'BudgetController',
    'financial-transactions' => 'FinancialTransactionController',
]);

Route::get('expenses-graph-data', 'FinancialTransactionController@tagsAndLinkedTagsFromExpenses')->middleware('auth');
Route::get('tag-frequency', 'FinancialTransactionController@expensesFrequency')->middleware('auth');

Route::get('/static-url/louis-berger/maison-repos-DTA2', 'HomeController@louis');