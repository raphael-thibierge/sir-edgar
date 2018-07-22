<?php

namespace App\Http\Controllers;

use App\Budget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BudgetController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return $this->successResponse([
            'budgets' => Auth::user()->budgets,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->authorize('create', Budget::class);

        $user = Auth::user();

        $this->validate($request, [
            'name' => 'required|string',
            'amount' => 'required|numeric',
            'currency' => 'required|in:€,CAD',
            'period' => 'required|in:week,month',
            'tags' => 'present',
        ]);


        $tagsAsString = str_replace('#', '', strtolower(trim($request->get('tags'))));

        $tags = $tagsAsString !== "" ? explode(' ', $tagsAsString) : [];

        $budget = $user->budgets()->create([
            'name' => $request->get('name'),
            'amount' => (float)$request->get('amount'),
            'currency' => $request->get('currency'),
            'period' => $request->get('period'),
            'tags' => $tags,
        ]);

        return $this->successResponse([
            'budget' => $budget
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Budget  $budget
     * @return \Illuminate\Http\Response
     */
    public function show(Budget $budget)
    {
        $this->authorize($budget);
        return $this->successResponse([
            'budget' => Budget::findOrFail($budget->id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Budget  $budget
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Budget $budget)
    {
        $this->authorize($budget);
        $this->validate($request, [
            'name' => 'required|string',
            'amount' => 'required|numeric',
            'currency' => 'required|in:€,CAD',
            'period' => 'required|in:week,month',
            'tags' => 'present',
        ]);
        $budget->update($request->all());
        return $this->successResponse([
            'budget' => $budget
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Budget  $budget
     * @return \Illuminate\Http\Response
     */
    public function destroy(Budget $budget)
    {
        $this->authorize($budget);
        $budget->delete();
        return $this->successResponse();
    }
}