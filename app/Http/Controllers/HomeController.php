<?php

namespace App\Http\Controllers;

use App\FinancialTransaction;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     */
    public function __construct()
    {
        $this->middleware('auth', ['only' => ['index', 'initialAppRequest']]);
    }

    public function initialAppRequest(){
        return $this->successResponse([
            'user'=> User::with('oAuthConnections')->find(Auth::user()->id),
            'pusher' => [
                'key' => config('broadcasting.connections.pusher.key'),
                'cluster' => config('broadcasting.connections.pusher.options.cluster'),
            ]
        ]);
    }

    public function linkedTags($initialTag){

        $linkedTags = FinancialTransaction::whereRaw(['tags' => $initialTag])->pluck('tags')->collapse()->unique();

        $linkedTagsWithWeigth = [];

        foreach ($linkedTags as $tag){
            if ($tag !== $initialTag)
            $linkedTagsWithWeigth[$tag] = FinancialTransaction::whereRaw(['tags' => $tag])->count();
        }

        return $linkedTagsWithWeigth;

    }

    public function tagsAndLinkedTagsFromExpenses(){

        $tags = FinancialTransaction::raw(function ($collection) {
            return $collection->aggregate([
                [
                    '$addFields' => [
                        'tags_to_slit' => '$tags'
                    ]
                ], [
                    '$unwind' => '$tags_to_slit'
                ], [
                    '$graphLookup' => [
                        'from' => 'financial_transactions',
                        'startWith' => '$tags_to_slit',
                        'connectFromField' => 'tags_to_slit',
                        'connectToField' => 'tags',
                        'as' => 'linked_tags'
                    ]
                ], [
                    '$project' => [
                        'tags_to_slit' => 1,
                        'linked_tags' => '$linked_tags.tags',
                    ]
                ], [
                    '$group' => [
                        '_id' => '$tags_to_slit',
                        'linked_tags' => [
                            '$first' => '$linked_tags',
                        ],
                    ]
                ]
            ]);
        })->toArray();

        $nodes = [];
        $arrows = [];
        $occurence_field=  'strength';
        foreach ($tags as $tag){

            // save node
            $tagSlug = $tag['_id'];
            $nodes []= [
                'id' => $tagSlug,
                'label' => $tagSlug,
                'color' => 'blue',
                'radius' => 15,
            ];

            //$arrows[$tagSlug] = [];
            foreach ($tag['linked_tags'] as $linked_tag_in_expense){
                foreach ($linked_tag_in_expense as $linked_tag){
                    //if ($linked_tag !== $tag['_id'] && isset($arrows[$tag['_id']])){
                    if ($linked_tag !== $tagSlug){
                        $arrows[$linked_tag . '_' . $tagSlug] = [
                            'from' => $tagSlug,
                            'to' => $linked_tag,
                          //  $occurence_field => 1,
                        ];
                            /*$arrows[$linked_tag . '_' . $tagSlug][$occurence_field]++;
                        /*if (isset($arrows[$linked_tag. '_' . $tagSlug]) ) {
                            $arrows[$linked_tag . '_' . $tagSlug][$occurence_field]++;


                        } elseif (isset($arrows[ $tagSlug. '_' . $linked_tag])){
                            $arrows[$tagSlug . '_' . $linked_tag ][$occurence_field]++;
                        } else {
                            $arrows[$linked_tag . '_' . $tagSlug] = [
                                'from' => $tagSlug,
                                'to' => $linked_tag,
                                $occurence_field => 1,
                            ];
                        }*/
                   }
                }
            }
        }
        $data = [
            'nodes' => $nodes,
            'arrows' => array_values($arrows),
        ];

        return $this->successResponse($data);

    }


    public function test(){



    }
}
