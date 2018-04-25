@extends('layouts.app')

@section('description', config('app.name', 'Sir Edgar') . ' dashboard. Start boosting your productivity here !')

@section('content')

    <style>
        @media (min-width: 768px) {
            .container-small {
                width: 300px;
            }
            .container-large {
                width: 970px;
            }
        }
        @media (min-width: 992px) {
            .container-small {
                width: 500px;
            }
            .container-large {
                width: 1170px;
            }
        }
        @media (min-width: 1200px) {
            .container-small {
                width: 700px;
            }
            .container-large {
                width: 1500px;
            }
        }

        .container-small, .container-large {
            max-width: 100%;
        }

    </style>
<div class="container container-large">
    <div class="row">
        <div id="app-productivity" class="col-xs-12">
            <img src="/images/logo-min.png" alt="" class="img-responsive img-circle img-rounded img-thumbnail">
            <input type="hidden" value="React not loaded">
        </div>
    </div>
</div>
<script>
    window.app = 'productivity'
</script>

@includeWhen(!Auth::guest() && Auth::user()->isAdmin(), 'facebook-messenger-plugin')

@endsection
