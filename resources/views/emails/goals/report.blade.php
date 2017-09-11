@component('mail::message')
# Goals report



@if ($goals->count() > 0)
This is the goal list you achieve {{ $period }} !


<?php $total = 0; ?>
@component('mail::table')
| Goal          | Project | Score     |
| ------------- | ------- | --------: |
@foreach($goals as $goal)
| {{ ucfirst($goal->title) }} | {{ $goal->project->title }} | {{ $goal->score }}      |
<?php $total += $goal->score; ?>
@endforeach
| | | |
| Total | | {{ $total}} |

@endcomponent

### Well done, your total score is {{ $total }} !

@else
    You didn't achieve any goals {{ $period }}..
@endif

Thanks,<br>
{{ config('app.name') }}
@endcomponent

