@extends('layouts.app')

@section('description', config('app.name', 'Sir Edgar') . ' dashboard. Start boosting your productivity here !')

@section('content')
<div class="container">
    <div class="row">
            <div id="project-root">
                <!-- React component will be inserted here by app.js script, included in app.layout -->
            </div>
            <div id="goal-root">
                <!-- React component will be inserted here by app.js script, included in app.layout -->
            </div>

    </div>
</div>
@endsection
