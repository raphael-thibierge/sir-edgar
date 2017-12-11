<?php

namespace App\Http\Controllers;

use App\MoneyValue;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MoneyValueController extends Controller
{


    public function twentyFourHourValues(string $currency){

        $user = Auth::user();

        $values = MoneyValue::where('created_at', '>=', Carbon::now($user->timezone)->subDays(3))
            ->where('currency', strtoupper($currency))
            ->get();

        return $this->successResponse([
            'values' => $values
        ]);
    }
}
