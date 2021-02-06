<?php

use App\User;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddScoreGoalInUserCollection extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
	    Schema::connection(env('DB_CONNECTION', config('DB_CONNECTION')))->table('users', function (Blueprint $table) {
            $table->integer('daily_score_goal')->unsigned()->default(5);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::connection('pgsql')->table('users', function (Blueprint $table) {
            $table->dropColumn('daily_score_goal');
        });
    }
}
