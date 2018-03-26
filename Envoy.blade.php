

@servers(['web' => 'ubuntu@sir-edgar.com'])

@task('deploy', ['on' => ['web']])

    cd sir-edgar/

    php artisan down

    @if ($branch)
        git checkout  {{ $branch }}

        git pull origin {{ $branch }}
    @else
        git pull
    @endif

    composer install

    php artisan migrate --force

    php artisan config:cache

    php artisan route:cache

    php artisan horizon:terminate

    php artisan up


@endtask