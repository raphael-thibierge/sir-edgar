<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConvertUserFromMongoToSQLSeeder extends Seeder
{
    /**
     * Run the database seeders.
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

            // remove wrong users
            if (!isset($user['email']) || empty($user['email'])){
                // remove user's data
                \App\Project::where('user_id', $oldUserId)->delete();
                \App\Goal::where('user_id', $oldUserId)->delete();
                \App\FinancialTransaction::where('user_id', $oldUserId)->delete();
                \App\Budget::where('user_id', $oldUserId)->delete();
                \App\OAuthConnection::where('user_id', $oldUserId)->delete();
                \App\BotMessage::where('user_id', $oldUserId)->delete();
                return;
            }

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
            $newUserId = \'App\Models\User'::latest()->first()->id;

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
