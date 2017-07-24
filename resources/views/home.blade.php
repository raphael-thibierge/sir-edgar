@extends('layouts.app')

@section('content')
<div class="container">

    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="alert alert-info">
                <strong>Info.</strong>
                Datetimes are based on Europe/Paris timezone.
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-8 col-md-offset-2">

            <div id="goal-root">
                <!-- React component will be inserted here by app.js script, included in app.layout -->
            </div>

        </div>
    </div>
</div>
@endsection
