<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Horizon\Horizon;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy',
        'App\FinancialTransaction' => 'App\Policies\FinancialTransactionPolicy',
        'App\Budget' => 'App\Policies\BudgetPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // Setup horizon access
        Horizon::auth(function ($request) {
            return $request->user() !== null && $request->user()->isAdmin();
        });
    }
}
