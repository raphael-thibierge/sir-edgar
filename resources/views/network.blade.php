@extends('layouts.app')

@section('description', config('app.name', 'Sir Edgar') . ' dashboard. Start boosting your productivity here !')

@section('content')

    <div class="row">
        <div class="col-xs-12">
            <div id="network">
                <p>loading..</p>
            </div>
        </div>
    </div>


<script>
    window.app = 'network'
</script>
@endsection
