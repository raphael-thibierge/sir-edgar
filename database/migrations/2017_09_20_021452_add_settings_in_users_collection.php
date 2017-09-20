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
        Schema::table('users', function (Blueprint $table) {
            $table->string('timezone')->default('Europe/Paris');
            $table->boolean('email_daily_report')->default(true);
            $table->boolean('email_weekly_report')->default(true);
        });

        User::whereNull('timezone')->update([
            'timezone' => 'Europe/Paris',
        ]);
        User::whereNull('email_daily_report')->update([
            'email_daily_report' => true
        ]);
        User::whereNull('email_weekly_report')->update([
            'email_weekly_report' => true
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('timezone');
            $table->dropColumn('email_daily_report');
            $table->dropColumn('email_weekly_report');
        });
    }
}
