<?php


use Illuminate\Support\Facades\Route;

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

//Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::view('/', 'welcome');

Auth::routes();

Route::view('home', 'home')->name('home')->middleware('auth');
Route::view('privacy-policy', 'policy')->name('privacy.policy ');

Route::get('app/load', [App\Http\Controllers\HomeController::class, 'initialAppRequest'])->name('app.load');

Route::match(['get', 'post'], '/botman', [App\Http\Controllers\BotManController::class, 'handle']);

Route::prefix('goals')->group(function (){
    Route::post('{goal}/set-completed', [App\Http\Controllers\GoalController::class, 'complete'])->name('goals.complete');
    Route::post('{goal}/set-today', [App\Http\Controllers\GoalController::class, 'setToday'])->name('goals.set_today');
    Route::post('{goal}/re-complete', [App\Http\Controllers\GoalController::class, 'reComplete'])->name('goals.re-complete');
    Route::get('score', [App\Http\Controllers\GoalController::class, 'goalScorePerDay'])->name('goals.score-per-day');
    Route::get('current-score', [App\Http\Controllers\GoalController::class, 'currentScore'])->name('goals.current-score');
    Route::get('completed/stats', [App\Http\Controllers\GoalController::class, 'completedStats'])->name('goals.completed.stats');
});


Route::prefix('user')->group(function (){
    Route::post('update-daily-score-goal', [App\Http\Controllers\UserController::class, 'updateDailyScoreGoal'])->name('goals.daily-score-goal.update');
});


Route::match(['get', 'post'], '/botman', [App\Http\Controllers\BotManController::class, 'handle'])->middleware('botman');
Route::match(['get', 'post'], '/botman/authorize', [App\Http\Controllers\BotManController::class, 'showMessengerLoginForm'])->middleware('botman')->name('botman.authorize');
Route::post('/botman/authorize', [App\Http\Controllers\BotManController::class, 'authorizePost'])->middleware('botman')->name('botman.authorize.post');
Route::post('/botman/confirm', [App\Http\Controllers\BotManController::class, 'confirm'])->middleware('botman')->name('botman.confirm');
Route::get('/botman/confirm', [App\Http\Controllers\BotManController::class, 'showConfirm'])->middleware('botman')->name('botman.confirm.show');


Route::post('/dialogflow/webhook', [App\Http\Controllers\BotController::class, 'dialogflow'])->middleware('botman')->name('doalogflow');
Route::get('/dialogflow/messenger/{senderId}/authorize', [App\Http\Controllers\BotController::class, 'messengerAuthorizePost'])->name('dialogflow.authorize.messenger.post');


Route::get('/bot/requests', [App\Http\Controllers\BotController::class, 'index'])->name('dailogflow.webhooks.index');
Route::get('/bot/requests/{botMessage}/', [App\Http\Controllers\BotController::class, 'show'])->name('dailogflow.webhooks.show');
//Route::get('/dialogflow/webhooks/{webhook}', [App\HttpDialogflowControllerControllers\BotManController::class, 'handlehow])'')->name('dailogflow.webhooks.show');

    
Route::view('finance', 'finance')->middleware('auth')->name('finance');


Route::get('money-values/24h/{currency}', [App\Http\Controllers\MoneyValueController::class, 'twentyFourHourValues'])
    ->name('money_values.24h')
    ->middleware('auth');


Route::prefix('oauth/{service}/')->group(function (){
    Route::get('authorize', [App\Http\Controllers\OAuthConnectionController::class, 'oAuthAuthorize'])->name('oauth.authorize');
    Route::get('callback', [App\Http\Controllers\OAuthConnectionController::class, 'oAuthAuthorizeCallback'])->name('oauth.callback');
});

Route::view('account', 'user')->name('account');
Route::post('account/update', [App\Http\Controllers\UserController::class, 'accountSettingsUpdate'])->name('account.update')->middleware('auth');

Route::get('financial-transactions/download',  [App\Http\Controllers\FinancialTransactionController::class, 'download'])->middleware('auth');
Route::get('budget/download', [App\Http\Controllers\FinancialTransactionController::class, 'download'])->middleware('auth');
Route::get('projects/ids', [App\Http\Controllers\ProjectController::class, 'indexIdName'])->middleware('auth');

Route::apiResources([
    'users' => App\Http\Controllers\UserController::class,
    'projects' => App\Http\Controllers\ProjectController::class,
    'goals' => App\Http\Controllers\GoalController::class,
    'budgets' => App\Http\Controllers\BudgetController::class,
    'financial-transactions' => App\Http\Controllers\FinancialTransactionController::class
]);

Route::get('expenses-graph-data', [App\Http\Controllers\FinancialTransactionController::class, 'tagsAndLinkedTagsFromExpenses'])->middleware('auth');
Route::get('tag-frequency', [App\Http\Controllers\FinancialTransactionController::class, 'expensesFrequency'])->middleware('auth');