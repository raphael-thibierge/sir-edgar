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
            'price'         => 'required|numeric',
            'currency'      => 'required|string',
            'date'    => 'present|date'
        ]);

        $user = Auth::user();

        $data = [];
        foreach ($request->request->keys() as $key){
            if (($value = $request->get($key)) !== null && $key !== '_token'){

                switch ($key){
                    case 'price': $value = (float)$value; break;
                    case 'date':
                        $value = new Carbon($value);
                        $value->subHours($value->getOffset()/3600);
                        break;
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
        $this->validate($request, [
            'title'         => 'required|string',
            'description'   => 'present|string|nullable',
            'tags'          => 'present|array|nullable',
            'price'         => 'required|numeric',
            'currency'      => 'required|string',
            'date'          => 'present|date'
        ]);

        $data = [];
        foreach ($request->request->keys() as $key){
            if (($value = $request->get($key)) !== null && $key !== '_token'){

                switch ($key){
                    case 'price': $value = (float)$value; break;
                    case 'date':
                        $value = new Carbon($value);
                        break;
                    default: break;
                }

                $data [$key] = $value;
            }
        }

        $financialTransaction->update($data);

        return $this->successResponse([
            'transaction' => $financialTransaction
        ]);
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

    public function tagsAndLinkedTagsFromExpenses(){

        $tags = FinancialTransaction::raw(function ($collection) {
            return $collection->aggregate([
                [
                    '$match' => [
                        'user_id' => Auth::user()->id,
                        'type' => 'expense',
                    ]
                ],
                [
                    '$unwind' => '$tags'
                ], [
                    '$group' => [
                        '_id' => '$tags',
                        'price' => ['$sum' => '$price'],
                        'occurrence' => ['$sum' => 1,],
                    ]
                ],[
                    '$graphLookup' => [
                        'from' => 'financial_transactions',
                        'startWith' => '$_id',
                        'connectFromField' => '_id',
                        'connectToField' => 'tags',
                        'as' => 'linked_tags'
                    ]
                ], [
                    '$project' => [
                        '_id' => 1,
                        'price' => 1,
                        'occurrence' => 1,
                        'linked_tags' => '$linked_tags.tags',
                    ]
                ]
            ]);
        })->toArray();



        $nodes = [];
        $arrows = [];
        $occurrence_field=  'value';
        $cpt = 0;
        foreach ($tags as $tag){

            // save node
            $tagSlug = $tag['_id'];
            $nodes []= [
                'id' => $tagSlug,
                'label' => $tagSlug,
                'color' => 'blue',
                'radius' => 15,
                'size' => 15  + ($tag['price']/10),
                'occurence' => $tag['occurrence'],
                'mass' => 1+(2/($tag['occurrence'])),
                'font' => [
                    'size' => 20  + ($tag['price']/10)
                ]
            ];

            //$arrows[$tagSlug] = [];
            foreach ($tag['linked_tags'] as $linked_tag_in_expense){
                foreach ($linked_tag_in_expense as $linked_tag){
                    //if ($linked_tag !== $tag['_id'] && isset($arrows[$tag['_id']])){
                    if ($linked_tag !== $tagSlug){
                        $cpt++;

                        if (isset($arrows[$linked_tag. '_' . $tagSlug]) ) {
                            $arrows[$linked_tag . '_' . $tagSlug][$occurrence_field]++;
                        } elseif (isset($arrows[ $tagSlug. '_' . $linked_tag])){
                            $arrows[$tagSlug . '_' . $linked_tag ][$occurrence_field]++;
                        } else {
                            $arrows[$linked_tag . '_' . $tagSlug] = [
                                'from' => $tagSlug,
                                'to' => $linked_tag,
                                $occurrence_field => 1,
                            ];
                        }
                    }
                }
            }
        }
        $data = [
            'nodes' => $nodes,
            'edges' => array_values($arrows),
        ];


        return $this->successResponse($data);

    }

    public function expensesFrequency(Request $request){
        $tag = explode(' ', $request->get('tag'));

        $tagsFrequency = FinancialTransaction::raw(function ($collection) use ($tag) {
            return $collection->aggregate([
                ['$match' => [
                    'tags' => [ '$in' => $tag],
                    'type' => 'expense',
                    'user_id' => Auth::user()->id,
                ]],
                ['$group' => [
                    '_id' => ['week' => ['$isoWeek' => '$date'], 'year' => ['$isoWeekYear' => '$date']],
                    'occurrence' => ['$sum' => 1],
                    'price' => ['$sum' => '$price'],
                ]],
                ['$sort' => ['_id.year' => 1, '_id.week' => 1]]
            ]);
        })->toArray();

        return $this->successResponse([
            'tag' => $tag,
            'frequencies' => $tagsFrequency
        ]);
    }
}
