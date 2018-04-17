<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddProjectIdInGoalsCollection extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::connection('mongodb')->table('goals', function (Blueprint $table) {
            $table->bigInteger('project_id')->nullable();
            $table->foreign('project_id')
                ->references('_id')
                ->on('project')
                ->onDelete('cascade');
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
            $table->dropForeign('project_id');
            $table->dropColumn('project_id');
        });
    }
}
