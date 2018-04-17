<?php

use App\FinancialTransaction;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDateFieldInFinancialTransactionsCollection extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::connection('mongodb')->table('financial_transactions', function (Blueprint $collection){
            $collection->dateTime('date');
        });

        /*FinancialTransaction::all()->each(function(FinancialTransaction $transaction){
            $transaction->update(['date' => $transaction->created_at]);
        });*/
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::connection('mongodb')->table('financial_transactions', function (Blueprint $collection){
            $collection->dropColumn('date');
        });
    }
}
