#! /bin/bash
cd laradock-sir-edgar/

docker-compose up -d php-fpm nginx postgres mongo redis php-worker workspace


