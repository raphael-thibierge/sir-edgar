@extends('layouts.app')

@section('description', config('app.name', 'Sir Edgar') . ' dashboard. Start boosting your productivity here !')

@section('content')
<link type="text/css" rel="stylesheet" href="css/vis.4.2.0.min.css">
<script type="text/javascript" src="/js/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="/js/jquery-ui-1.8.16.min.js"></script>
<div class="container">
    <div class="row">
        <div id="app-finance" class="col-xs-12">
            <img src="/images/logo-min.png" alt="" class="img-responsive img-circle img-rounded img-thumbnail">
        </div>
    </div>
</div>
<script>
    window.app = 'finance'
</script>
@endsection
