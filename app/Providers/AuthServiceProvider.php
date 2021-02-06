<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        FinancialTransaction::class => FinancialTransactionPolicy::class,
        Budget::class => BudgetPolicy::class,
        Project::class => ProjectPolicy::class,
        Goal::class => GoalPolicy::class,
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
        //Horizon::auth(function ($request) {
        //    return $request->user() !== null && $request->user()->isAdmin();
        //});


        // Passport
        //Passport::routes();
        //
    }
}
