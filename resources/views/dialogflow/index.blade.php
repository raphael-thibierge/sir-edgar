@extends("layouts.app")



@section("content")
<div class="row col-xs-12">
    <div class="container">
        <h1>Dialogflow webhooks</h1>
        <table class="table table-responsive table-bordered table-hover">
            <thead>
                <td>ID</td>
                <td>Source</td>
                <td>Action</td>
                <td>User ID</td>
                <td>User email</td>
                <td>Created at</td>
            </thead>
            <tbody>
            @foreach($webhooks as $webhook)
                <tr>
                    <td><a href="{{ route('dailogflow.webhooks.show', ['webhook' => $webhook]) }}">{{ $webhook->id }}</a></td>
                    <td>{{ $webhook->getSource() }}</td>
                    <td>{{ $webhook->getAction() }}</td>
                    <td>{{ $webhook->user->id }}</td>
                    <td>{{ $webhook->user->email }}</td>
                    <td>{{ $webhook->created_at }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>

        {{ $webhooks->links() }}

    </div>
</div>
@endsection