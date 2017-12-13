@extends('layouts.app')

@section('description', config('app.name', 'Sir Edgar') . ' dashboard. Start boosting your productivity here !')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-xs-12">
            <div class="alert alert-success">
                <p>Your account as been successfully linked !</p>
            </div>
        </div>
    </div>
</div>
@endsection
