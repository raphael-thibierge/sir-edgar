<?php

namespace Tests\Unit;

use App\FinancialTransaction;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class FinancialTransactionResourceTest extends TestCase
{

    /**
     * @var User
     */
    private $user = null;


    public function setUp(): void
    {
        parent::setUp(); // TODO: Change the autogenerated stub

        $this->user = factory(User::class)->create();
    }

    public function testNoTransactionInIndex()
    {
        $response = $this->actingAs($this->user)->get('financial-transactions');
        $response
            ->assertStatus(200)
            ->assertJsonCount(0, 'data.transactions');

    }

    public function testStoreTransaction(){

        $transaction = factory(FinancialTransaction::class)->make();

        $response = $this->actingAs($this->user)->postJson('financial-transactions', $transaction->toArray());

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'transaction'
                ]
            ]);
    }

    public function testTransactionsInIndex()
    {
        $nbTransactions = 3;
        factory(FinancialTransaction::class, $nbTransactions)->make()->each(function (FinancialTransaction $transaction){
            $this->user->financialTransactions()->create($transaction->toArray());
        });

        $response = $this->actingAs($this->user)->get('financial-transactions');
        $response
            ->assertStatus(200)
            ->assertJsonCount(3, 'data.transactions');
    }

    public function testShowTransaction()
    {
        $transaction = factory(FinancialTransaction::class)->make();
        $transaction = $this->user->financialTransactions()->create($transaction->toArray());

        $response = $this->actingAs($this->user)->get(
            route('financial-transactions.show', [
                'financial-transactions' => $transaction
            ])
        );

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'transaction' => [
                        '_id',
                        'title',
                        'price',
                        'currency',
                        'type',
                        'tags'
                    ]
                ]
            ])
            ->assertJson([
                'data' => [
                    'transaction' => [
                        '_id' => $transaction->id
                    ],
                ]
            ]);
    }

    public function testUserCanNotShowOtherUserTransaction()
    {
        $transaction = factory(FinancialTransaction::class)->make();
        $transaction = $this->user->financialTransactions()->create($transaction->toArray());

        $response = $this->actingAs(factory(User::class)->create())->get(
            route('financial-transactions.show', [
                'financial-transactions' => $transaction
            ])
        );

        $response
            ->assertStatus(403);
    }

    public function testUserDestroyTransaction(){
        $transaction = factory(FinancialTransaction::class)->make();
        $transaction = $this->user->financialTransactions()->create($transaction->toArray());

        $response = $this->actingAs($this->user)->delete(
            route('financial-transactions.show', [
                'financial-transactions' => $transaction
            ])
        );

        $response
            ->assertStatus(200);
    }

    public function testUserCanNotDestroyOtherUserTransaction(){
        $transaction = factory(FinancialTransaction::class)->make();
        $transaction = $this->user->financialTransactions()->create($transaction->toArray());

        $response = $this->actingAs(factory(User::class)->create())->delete(
            route('financial-transactions.show', [
                'financial-transactions' => $transaction
            ])
        );

        $response
            ->assertStatus(403);
    }

    public function testUserCanUpdateTransaction()
    {
        $transaction = factory(FinancialTransaction::class)->make();
        $transaction = $this->user->financialTransactions()->create($transaction->toArray());

        $transaction->title = 'HelloWorld';

        $response = $this->actingAs($this->user)->put(
            route('financial-transactions.update', [
                'financial-transactions' => $transaction
            ])
        , $transaction->toArray());

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'transaction' => [
                        '_id',
                        'title',
                        'price',
                        'currency',
                        'type',
                        'tags'
                    ]
                ]
            ])
            ->assertJson([
                'data' => [
                    'transaction' => [
                        '_id' => $transaction->id,
                        'title' => $transaction->title,
                    ],
                ]
            ]);
    }

    public function testUserCanNotUpdateOtherUserTransaction(){
        $transaction = factory(FinancialTransaction::class)->make();
        $transaction = $this->user->financialTransactions()->create($transaction->toArray());

        $newTitle = 'HelloWorld';
        $transaction->title = $newTitle;


        $response = $this->actingAs(factory(User::class)->create())->putJson(
            route('financial-transactions.update', [
                'financial-transactions' => $transaction
            ]), $transaction->toArray()
        );

        $response
            ->assertStatus(403);
    }

    public function testExpenseTransactionToString(){
        $transaction = factory(FinancialTransaction::class)->make([
            'title' => 'a expense',
            'price' => 2.05,
            'currency' => 'EUR',
            'tags' => ['tag1', 'tag2'],
            'type' => 'expense'
        ]);

        $this->assertEquals('expense : 2.05 EUR #tag1#tag2', $transaction->toString());
    }

    public function testEntranceTransactionToString(){
        $transaction = factory(FinancialTransaction::class)->make([
            'title' => 'a entrance',
            'price' => 2.05,
            'currency' => 'EUR',
            'tags' => ['tag1', 'tag2'],
            'type' => 'entrance'
        ]);

        $this->assertEquals('entrance : 2.05 EUR #tag1#tag2', $transaction->toString());
    }

    public function testTransactionUserRelationShip(){
        $transaction = factory(FinancialTransaction::class)->make();
        $transaction = $this->user->financialTransactions()->create($transaction->toArray());
        $this->assertEquals($this->user->id, $transaction->user->id);
    }

}
