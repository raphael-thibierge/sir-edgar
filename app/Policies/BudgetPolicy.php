<?php

namespace App\Policies;

use App\User;
use App\Budget;
use Illuminate\Auth\Access\HandlesAuthorization;

class BudgetPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the budget.
     *
     * @param  \App\User  $user
     * @param  \App\Budget  $budget
     * @return mixed
     */
    public function view(User $user, Budget $budget)
    {
        return $user->id === $budget->user_id;
    }

    /**
     * Determine whether the user can create budgets.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can update the budget.
     *
     * @param  \App\User  $user
     * @param  \App\Budget  $budget
     * @return mixed
     */
    public function update(User $user, Budget $budget)
    {
        return $user->id === $budget->user_id;
    }

    /**
     * Determine whether the user can delete the budget.
     *
     * @param  \App\User  $user
     * @param  \App\Budget  $budget
     * @return mixed
     */
    public function delete(User $user, Budget $budget)
    {
        return $user->id === $budget->user_id;
    }
}
