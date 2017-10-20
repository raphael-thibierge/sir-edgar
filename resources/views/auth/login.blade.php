@extends('layouts.app')

@section('title')
    Login -- @parent
@endsection

@section('description', 'Log in ' . config('app.name') . ' to complete new goals and increase your productivity')

@section('content')
<div class="container">
    <div class="row">
        <div class="offset-sm-2 col-sm-8">
            <div class="card">
                <h4 class="card-header">Login</h4>
                <div class="card-body">
                    
                    <form role="form" method="POST" action="{{ route('login') }}">
                        {{ csrf_field() }}

                        @if(isset($_REQUEST['redirect_uri']))
                        <input type="hidden" name="redirect_uri" value="{{ $_REQUEST['redirect_uri'] }}">
                        @endif
                        @if(isset($_REQUEST['account_linking_token']))
                        <input type="hidden" name="account_linking_token" value="{{ $_REQUEST['account_linking_token'] }}">
                        @endif

                        <div class="form-group row">
                            <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
                            <div class="col-sm-10">
                                <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="email@example.com">
                            </div>
                        </div>

                        <div class="form-group {{ $errors->has('email') ? ' has-error' : '' }} row ">
                            <label for="email" class="col-sm-2 form-control-label">Email</label>

                            <div class="col-sm-10">
                                <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" required autofocus>

                                @if ($errors->has('email'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('email') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group {{ $errors->has('password') ? ' has-error' : '' }} row">
                            <label for="password" class="col-sm-2 form-control-label">Password</label>

                            <div class="col-sm-10">
                                <input id="password" type="password" class="form-control" name="password" required>

                                @if ($errors->has('password'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('password') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-sm-2"></div>
                            <div class="col-sm-10">
                                <div class="form-check">
                                    <label class="form-check-label">
                                        <input type="checkbox" class="form-check-input" name="remember" {{ old('remember') ? 'checked' : '' }}>
                                        Remember Me
                                    </label>
                                </div>
                            </div>
                        </div>


                        <div class="form-group row">

                            <div class="col-sm-2"></div>
                            <div class="col-sm-10">
                                <button type="submit" class="btn btn-primary">
                                    Login
                                </button>

                                <a class="btn btn-primary" href="/register{{ (isset($_REQUEST['redirect_uri']) ? '?redirect_uri=' . $_REQUEST['redirect_uri'] : '') . (isset($_REQUEST['account_linking_token']) ? '&account_linking_token=' . $_REQUEST['account_linking_token'] : '')}}">
                                    Create account
                                </a>

                                <a class="btn btn-link" href="{{ route('password.request') }}">
                                    Forgot Your Password?
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
