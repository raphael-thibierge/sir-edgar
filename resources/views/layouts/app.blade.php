<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@section('title'){{ config('app.name', 'Laravel') }}, your productivity assistant @show</title>
    <meta name="description" content="@section('description') Sir Edgard aims to help you make your goals done and track your productivity @show">


    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('css/react-day-picker.css') }}" rel="stylesheet">

    @if(env('APP_ENV') === 'production')
    <!-- Google analytics -->
    <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-106873842-1', 'auto');
        ga('send', 'pageview');

    </script>
    <!-- Google AdSense -->
    <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "ca-pub-6757486619789376",
            enable_page_level_ads: true
        });
    </script>
    @endif
    <style>
        .react-calendar-heatmap .color-scale-0 { fill: #ebedf0;}
        .react-calendar-heatmap .color-scale-1 { fill: #d6e685;}
        .react-calendar-heatmap .color-scale-2 { fill: #8cc665;}
        .react-calendar-heatmap .color-scale-3 { fill: #44a340;}
        .react-calendar-heatmap .color-scale-4 { fill: #1e6823;}
    </style>

</head>
<body style="background-color: #ffffff">
    <div id="app">
        <nav class="navbar navbar-default navbar-static-top">
            <div class="container">
                <div class="navbar-header">

                    <!-- Collapsed Hamburger -->
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#app-navbar-collapse">
                        <span class="sr-only">Toggle Navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>

                    <!-- Branding Image -->
                    <a class="navbar-brand" href="{{ url('/') }}">
                        {{ config('app.name', 'Laravel') }}
                    </a>
                </div>

                <div class="collapse navbar-collapse" id="app-navbar-collapse">

                    <!-- Right Side Of Navbar -->
                    <ul class="nav navbar-nav navbar-right">
                        <!-- Authentication Links -->
                        @if (Auth::guest())
                            <li><a href="{{ route('login') }}">Login</a></li>
                            <li><a href="{{ route('register') }}">Register</a></li>
                        @else
                            <li class="dropdown">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                                    {{ Auth::user()->name }} <span class="caret"></span>
                                </a>

                                <ul class="dropdown-menu" role="menu">
                                    <li>
                                        <a href="{{ route('logout') }}"
                                            onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                                            Logout
                                        </a>

                                        <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                            {{ csrf_field() }}
                                        </form>
                                    </li>
                                </ul>
                            </li>
                        @endif
                    </ul>
                </div>
            </div>
        </nav>

        @yield('content')
    </div>

    <!-- Scripts -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
    <script type="text/javascript">
        window.token = "{{ csrf_token() }}"
    </script>
    <script src="{{ asset('js/app.js') }}"></script>


    <script src="//cdn.headwayapp.co/widget.js"></script>
    <script>
        var config = {
            selector: ".change_log", // CSS selector where to inject the badge
            account: "xGMR2J", // your account ID,
        };
        //Headway.init(config);
    </script>

</body>
<footer>
    <hr>
    <div class="container">
        <div class="row">
            <div class="col-xs-2 col-xs-offset-8">
                <a href="{{ route('about') }}" class="text-right">About page</a>
            </div>
            <div class="col-xs-2">
                <a href="{{ route('privacy.policy ') }}" class="text-right">Privacy policy</a>
            </div>
        </div>
    </div>
    <br>
</footer>
</html>
