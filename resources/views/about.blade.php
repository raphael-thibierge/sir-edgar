@extends('layouts.app')


@section('title')
    About @parent
@endsection

@section('description', 'Learn more about Sir Edgar, your productivity assistant !')

@section('content')
<div class="container">

    <div class="row">
        <div class="col-xs-12">
            <div class="jumbotron">
                <h1>About</h1>
                <hr>
                <p>
                    I develop <strong>Sir Edgar</strong> during my free-time only. <br>
                    This app aims to help me <strong>improve my daily productivity</strong> by adding every morning my goals for the day<br>
                    If it's work for me, so why not for you ?
                </p>
                <br>
                <p class="text-right"><strong>Raphael THIBIERGE</strong><br>Creator and developer</p>
                <p class="text-right"></p>
            </div>
        </div>
    </div>
</div>
@endsection
