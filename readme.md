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
$ docker-compose up php-fpm nginx php-worker mongo postgres redis workspace
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
You may have a problem with python pip10 in workspace container,
[check this issue](https://github.com/pypa/pip/issues/5240)

Replace in `./laradock-sir-edgar/worskpace/Dockerfile` :
```
RUN if [ ${INSTALL_PYTHON} = true ]; then \
  apt-get -y install python python-pip python-dev build-essential  \
  && pip install --upgrade pip  \
  && pip install --upgrade virtualenv \
;fi
```

To :
```
RUN if [ ${INSTALL_PYTHON} = true ]; then \
  apt-get -y install python python-pip python-dev build-essential  \
  && pip install --upgrade pip==9.0.3  \
  && pip install --upgrade virtualenv \
;fi
``` 