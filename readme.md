# Docker setup

## Create the docker machine

```
$ docker-machine create sir-edgar
```

## Start docker machine
```
$ docker-machine start sir-edgar
```

## Setup machine environment
```
$ cp example-doker.env ./laradock-sir-edgar/.env
$ nano ./laradock-sir-edgar/.env # edit env
```

## Start docker machine
```
$ docker-machine env sir-edgar
$ eval $(docker-machine env sir-edgar)
$ cd ./laradock-sir-edgar/
$ docker-compose up -d php-fpm nginx php-worker workspace
```

## Enter in workspace bash to execute commands such as `artisan`
```
$ docker-compose exec --user=laradock workspace bash
```

## Re-build a container after editing env
```
$ docker-compose build {container-name}
```

## Delete containers
```
$ docker-compose down
```

## Stop docker machine
```
$ docker-machine stop sir-edgar
```

### Eventual problem
You may have a problem with python in workspace container,
check [this issue](https://github.com/pypa/pip/issues/5240)