@extends("layouts.app")



@section("content")
<div class="row col-xs-12">
    <div class="container">
        <h1>User list</h1>
        <table class="table table-responsive table-bordered table-hover">
            <thead>
                <td>ID</td>
                <td>Name</td>
                <td>Email</td>
                <td>Delete</td>
            </thead>
            <tbody>
            @foreach($users as $user)
                <tr>
                    <td>{{ $user->id }}</td>
                    <td>{{ $user->name }}</td>
                    <td>{{ $user->email }}</td>
                    <td>
                        <form action="{{route("users.destroy", ["user" => $user->id])}}" method="POST">
                            {{ csrf_field() }}
                            {{ method_field("DELETE") }}
                            <button class="btn btn-danger">
                                <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                            </button>
                        </form>
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection