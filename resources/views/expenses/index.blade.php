@extends("layouts.app")



@section("content")
<div class="row col-xs-12">
    <div class="container">
        <h1>Expens</h1>
        <table class="table table-responsive table-bordered table-hover">
            <thead>
                <td>ID</td>
                <td>Name</td>
                <td>Email</td>
                <td>Projects</td>
                <td>Goals</td>
                <td>Done goals</td>
            </thead>
            <tbody>

            <?php $total = 0.0; ?>
            @foreach($expenses as $expense)
                <tr>
                    <td>{{ $expense->id }}</td>
                    <td>{{ $expense->title }}</td>
                    <td>{{ $expense->description }}</td>
                    <td>{{ is_array($expense->tags) ? implode(', ', $expense->tags ) : $expense->tags}}</td>
                    <td>{{ $expense->price }}</td>
                    <td>{{ $expense->currency }}</td>
                    <?php $total += (float)$expense->price ?>
                </tr>
            @endforeach
            </tbody>
        </table>
        <div class="row">
            <div class="col-xs-12">
                Total : <?= $total ?>
            </div>
        </div>
    </div>
</div>

@endsection