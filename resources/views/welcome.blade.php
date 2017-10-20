@extends('layouts.app')

@section('content')

    <style>
        html, body {
            background-color: #fff;
            color: #636b6f;
            font-family: 'Raleway', sans-serif;
            font-weight: 100;
            height: 100vh;
            margin: 0;
        }

        .full-height {
            height: 100vh;
        }

        .flex-center {
            align-items: center;
            display: flex;
            justify-content: center;
        }

        .position-ref {
            position: relative;
        }

        .top-right {
            position: absolute;
            right: 10px;
            top: 18px;
        }

        .content {
            text-align: center;
        }

        .title {
            font-size: 84px;
        }

        .links > a {
            color: #636b6f;
            padding: 0 25px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: .1rem;
            text-decoration: none;
            text-transform: uppercase;
        }

        .m-b-md {
            margin-bottom: 30px;
        }
    </style>


    <div class="container">
        <div class="row">
            <div class="content">
                <div class="title m-b-md">
                    {{ config('app.name') }}
                </div>
                <div class="row">
                    <div class="col-sm-10 offset-sm-1">
                    <h3 class="text-center">
                        Sir-Edgar aims to improve your personal productivity by adding all your goals with a score
                        and helps you to complete your daily score goal !
                    </h3>
                        <br>
                    <a href="{{ route('home') }}" class="btn btn-outline-success">Get Started</a>
                </div>
                </div>
            </div>
        </div>
                <br>
        <div class="col-sm-10 offset-sm-1">
            <div class="thumbnail">
                <img src="{{ asset('images/screenshot.png') }}" alt="Sir Edgar dashboard screenshot" style="width: 100%">
            </div>
        </div>
    </div>

@endsection

