<?php

namespace App\Http\Controllers;

use App\Budget;
use App\Goal;
use App\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
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
        $projects = Auth::user()->projects()
            ->whereIsArchived(false)
            ->orderBy('title', 'ASC')
            ->with('goals')
            ->get();

        return $this->successResponse([
            'projects' => $projects,
        ]);
    }

    public function indexIdName(){
        $projects = Auth::user()->projects()
            ->whereIsArchived(false)
            ->orderBy('title', 'ASC')
            ->pluck('title', '_id');

        return $this->successResponse([
            'projects' => $projects,
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
        $this->authorize('create', Project::class);
        $this->validate($request, [
            'title' => 'required',
        ]);

        $project = Auth::user()->projects()->create([
            "title" => $request->get('title'),
            'is_archived' => false,
        ]);

        // by default goals is null, so must be init before sending it to UI
        $project->goals = [];


        return $this->successResponse([
            'project'  => $project
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function show(Project $project)
    {
        $this->authorize($project);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Project $project)
    {
        $this->authorize($project);

        $this->validate($request, [
            'title' => 'required|string',
            'is_archived' => 'required|bool'
        ]);

        $project->update([
            'title' => $request->get('title'),
            'is_archived' => (bool)$request->get('is_archived'),
        ]);

        return $this->successResponse([
            'project' => $project
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Project  $project
     * @return \Illuminate\Http\Response
     */
    public function destroy(Project $project)
    {
        $this->authorize($project);
    }
}
