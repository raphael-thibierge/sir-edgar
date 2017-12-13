@extends('layouts.app')

@section('description', config('app.name', 'Sir Edgar') . ' dashboard. Start boosting your productivity here !')

@section('content')
<div class="container">
    <div class="row">
        <div id="app-productivity" class="col-xs-12">
            <img src="/images/logo.png" alt="" class="img-responsive img-circle img-rounded img-thumbnail">
            <input type="hidden" value="React not loaded">
        </div>
    </div>
</div>
<script>
    window.app = 'productivity'
</script>
@endsection
