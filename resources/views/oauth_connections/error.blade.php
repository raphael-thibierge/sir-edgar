@extends('layouts.app')

@section('description', config('app.name', 'Sir Edgar') . ' dashboard. Start boosting your productivity here !')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-xs-12">
            <div class="alert alert-danger">
                <p>Your account as not been linked due to an error...</p>
            </div>
        </div>
    </div>
</div>
@endsection
