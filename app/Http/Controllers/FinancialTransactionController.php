<?php

namespace App\Http\Controllers;

use App\FinancialTransaction;
use App\User;
use Carbon\Carbon;
use Coinbase\Wallet\Resource\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FinancialTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();

        $financialTransactions = $user->financialTransactions()->get();

        return $this->successResponse([
            'transactions' => $financialTransactions
        ]);

    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function byTag($tag)
    {
        $user = Auth::user();

        $expense = $user->financialTransactions()->where('tags', '=', $tag)->get();

        return view('expenses.index', ['expenses' => $expense]);

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'title'         => 'required|string',
            'description'   => 'present|string|nullable',
            'tags'          => 'present|array|nullable',
            'price'        => 'required|numeric',
            'currency'      => 'required|string',
            'created_at'    => 'present|date'
        ]);

        $user = Auth::user();

        $data = [];
        foreach ($request->request->keys() as $key){
            if (($value = $request->get($key)) !== null && $key !== '_token'){

                switch ($key){
                    case 'price': $value = (float)$value; break;
                    case 'created_at': $value = new Carbon($value, $user->timezone); break;
                    default: break;
                }

                $data [$key] = $value;
            }
        }

        $transaction = $user->financialTransactions()->create($data);

        return $this->successResponse([
            'transaction' => $transaction
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\FinancialTransaction  $financialTransaction
     * @return \Illuminate\Http\Response
     */
    public function show(FinancialTransaction $financialTransaction)
    {
        return $this->successResponse([
            'transaction' => $financialTransaction
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\FinancialTransaction  $financialTransaction
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, FinancialTransaction $financialTransaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\FinancialTransaction  $financialTransaction
     * @return \Illuminate\Http\Response
     */
    public function destroy(FinancialTransaction $financialTransaction)
    {
        $financialTransaction->delete();
        return $this->successResponse();
    }
}
