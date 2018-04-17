<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddGoalsDetailsInGoalsCollection extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::connection('mongodb')->table('goals', function (Blueprint $table) {
            $table->dateTime('start_time_tracker')->nullable();
            $table->dateTime('end_time_tracker')->nullable();
            $table->date('due_date')->nullable();
            $table->integer('estimated_time')->unsigned()->nullable();
            $table->integer('time_spent')->unsigned()->nullable();
            $table->integer('priority')->unsigned()->min(0)->max(3)->defailt(0)->nullable();
            $table->longText('notes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::connection('mongodb')->table('goals', function (Blueprint $table) {
            $table->dropColumn('start_time_tracker');
            $table->dropColumn('end_time_tracker');
            $table->dropColumn('due_date');
            $table->dropColumn('estimated_time');
            $table->dropColumn('time_spent');
            $table->dropColumn('priority');
            $table->dropColumn('notes');
        });
    }
}
