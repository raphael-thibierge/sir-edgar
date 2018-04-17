<?php

namespace App\Policies;

use App\User;
use App\FinancialTransaction;
use Illuminate\Auth\Access\HandlesAuthorization;

class FinancialTransactionPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the financialTransaction.
     *
     * @param  \App\User  $user
     * @param  \App\FinancialTransaction  $financialTransaction
     * @return mixed
     */
    public function view(User $user, FinancialTransaction $financialTransaction)
    {
        return $user->id === $financialTransaction->user_id;
    }

    /**
     * Determine whether the user can create financialTransactions.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can update the financialTransaction.
     *
     * @param  \App\User  $user
     * @param  \App\FinancialTransaction  $financialTransaction
     * @return mixed
     */
    public function update(User $user, FinancialTransaction $financialTransaction)
    {
        return $user->id === $financialTransaction->user_id;
    }

    /**
     * Determine whether the user can delete the financialTransaction.
     *
     * @param  \App\User  $user
     * @param  \App\FinancialTransaction  $financialTransaction
     * @return mixed
     */
    public function delete(User $user, FinancialTransaction $financialTransaction)
    {
        return $user->id === $financialTransaction->user_id;
    }

    public function download(User $user){
        return true;
    }
}
