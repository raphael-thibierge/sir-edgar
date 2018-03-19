<?php

namespace App\Providers;

use App\Budget;
use App\FinancialTransaction;
use App\Goal;
use App\Policies\BudgetPolicy;
use App\Policies\FinancialTransactionPolicy;
use App\Policies\GoalPolicy;
use App\Policies\ProjectPolicy;
use App\Project;
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
        Horizon::auth(function ($request) {
            return $request->user() !== null && $request->user()->isAdmin();
        });
    }
}
