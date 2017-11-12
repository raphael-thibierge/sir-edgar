<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFinancialTransactionCollection extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('financial_transactions', function (Blueprint $table) {
            $table->increments('_id');
            $table->string('title')->nullable();
            $table->float('price');
            $table->string('currency');
            $table->string('description')->nullable();
            $table->enum('type', ['entrance', 'expense']);
            $table->bigInteger('user_id');
            $table->foreign('user_id')->references('_id')->on('users')->onDelete('cascade');
            //$table->array('tags');
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('financial_transactions');
    }
}
