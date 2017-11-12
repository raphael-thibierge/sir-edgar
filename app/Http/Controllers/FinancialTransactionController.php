<?php

namespace App\Http\Controllers;

use App\FinancialTransaction;
use App\User;
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

        $expense = $user->financialTransactions()->where('type', FinancialTransaction::EXPENSE)->get();

        return view('expenses.index', ['expenses' => $expense]);

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
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\FinancialTransaction  $financialTransaction
     * @return \Illuminate\Http\Response
     */
    public function show(FinancialTransaction $financialTransaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\FinancialTransaction  $financialTransaction
     * @return \Illuminate\Http\Response
     */
    public function edit(FinancialTransaction $financialTransaction)
    {
        //
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
        //
    }
}
