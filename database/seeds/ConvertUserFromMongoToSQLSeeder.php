<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConvertUserFromMongoToSQLSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // foreach user from MongoDB
        DB::connection('mongodb')->collection('users')->get()->each(function($user){

            // get old user id (string) to convert it to int
            $oldUserId = $user['_id']->__toString();
            unset($user['_id']);

            // transform created_at date
            $user['created_at'] = \Carbon\Carbon::createFromTimestamp(
                ((int)$user['created_at']->__toString())/1000, 'America/Toronto'
            )->format('Y-m-d H:i:s');

            // transform updated_at date
            $user['updated_at'] = \Carbon\Carbon::createFromTimestamp(
                ((int)$user['updated_at']->__toString())/1000, 'America/Toronto'
            )->format('Y-m-d H:i:s');

            // insert user in SQL database
            DB::connection('pgsql')->table('users')->insert($user);

            // get new user id (intà
            $newUserId = \App\User::latest()->first()->id;

            // convert user_id in MongoDB collections
            \App\Project::where('user_id', $oldUserId)->update(['user_id' => $newUserId]);
            \App\Goal::where('user_id', $oldUserId)->update(['user_id' => $newUserId]);
            \App\FinancialTransaction::where('user_id', $oldUserId)->update(['user_id' => $newUserId]);
            \App\Budget::where('user_id', $oldUserId)->update(['user_id' => $newUserId]);
            \App\OAuthConnection::where('user_id', $oldUserId)->update(['user_id' => $newUserId]);
            \App\BotMessage::where('user_id', $oldUserId)->update(['user_id' => $newUserId]);

        });
    }
}
