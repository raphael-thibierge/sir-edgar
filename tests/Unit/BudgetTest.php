<?php

namespace Tests\Unit;

use App\Budget;
use App\FinancialTransaction;
use App\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BudgetTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testCreateUserBudget()
    {
        $user = factory(User::class)->create();
        $budget = factory(Budget::class)->make([
            'user_id' => $user->id
        ]);

        $user->budgets()->create($budget->toArray());

        self::assertCount(1, $user->budgets);
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testAddExpense()
    {
        $user = factory(User::class)->create();
        $budget = factory(Budget::class)->make([
            'user_id' => $user->id
        ]);

        $budget = $user->budgets()->create($budget->toArray());

        $expense = factory(FinancialTransaction::class)->states('expense', 'now')->create([
            'user_id' => $user->id
        ]);

        self::assertCount(1, $budget->expenses()->get());
        self::assertEquals($expense->price, $budget->getTotalAttribute());
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testDoNotCountLastWeekExpense()
    {
        $user = factory(User::class)->create();
        $budget = factory(Budget::class)->states('week')->make([
            'user_id' => $user->id
        ]);

        $budget = $user->budgets()->create($budget->toArray());

        $expense = factory(FinancialTransaction::class)->states('expense', 'now')->create([
            'user_id' => $user->id
        ]);
        $expense->update([
            'date' => \Carbon\Carbon::now()->startOfWeek()->subDays(1)
        ]);


        self::assertCount(0, $budget->expenses()->get());
        self::assertEquals(0, $budget->getTotalAttribute());
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testDoNotCountLastMonthExpense()
    {
        $user = factory(User::class)->create();
        $budget = factory(Budget::class)->states('month')->make([
            'user_id' => $user->id
        ]);

        $budget = $user->budgets()->create($budget->toArray());

        $expense = factory(FinancialTransaction::class)->states('expense', 'now')->create([
            'user_id' => $user->id
        ]);
        $expense->update([
            'date' => \Carbon\Carbon::now()->startOfMonth()->subDays(1)
        ]);


        self::assertCount(0, $budget->expenses()->get());
        self::assertEquals(0, $budget->getTotalAttribute());
    }
}
