<?php

use App\User;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSettingsInUsersCollection extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::connection('pgsql')->table('users', function (Blueprint $table) {
            $table->string('timezone')->default('UTC');
            $table->boolean('email_daily_report')->default(true);
            $table->boolean('email_weekly_report')->default(true);
            $table->boolean('morning_report')->default(false);
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
            $table->dropColumn('timezone');
            $table->dropColumn('email_daily_report');
            $table->dropColumn('email_weekly_report');
            $table->dropColumn('morning_report');
        });
    }
}
