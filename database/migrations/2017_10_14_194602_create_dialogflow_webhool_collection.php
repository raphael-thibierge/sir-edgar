<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDialogflowWebhoolCollection extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::connection('mongodb')->create('dialogflow_webhooks', function (Blueprint $table) {
            $table->increments('_id');
            $table->json('request');
            $table->bigInteger('user_id');
            $table->foreign('user_id')->references('_id')->on('users')->onDelete('cascade');
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
        Schema::connection('mongodb')->drop('dialogflow_webhooks');
    }
}
