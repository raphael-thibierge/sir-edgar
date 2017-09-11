@component('mail::message')
# Goals report

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


Thanks,<br>
{{ config('app.name') }}
@endcomponent

