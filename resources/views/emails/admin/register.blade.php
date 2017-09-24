@component('mail::message')
# New user registered !

{{ $user->name }},
{{ $user->email }}

Have a good day,<br>
{{ config('app.name') }}
@endcomponent
