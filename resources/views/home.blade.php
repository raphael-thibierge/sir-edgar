@extends('layouts.app')

@section('description', config('app.name', 'Sir Edgar') . ' dashboard. Start boosting your productivity here !')

@section('content')
<div class="container">
    <div class="row">
        <div id="app-root" class="col-sm-12">
            <img src="/images/logo.png" alt="" class="img-fluid rounded-circle rounded ">
        </div>
    </div>
</div>
@endsection
