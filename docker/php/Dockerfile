# composer
ARG PHP_VERSION="7.3"
ARG COMPOSER_VERSION="2.0"

FROM composer:${COMPOSER_VERSION} as composer_version


# main
FROM php:${PHP_VERSION}-fpm-alpine
MAINTAINER RAPHAEL THIBIERGE

#RUN apk add --no-cache php7-dev alpine-sdk

RUN docker-php-ext-install tokenizer

RUN docker-php-ext-install pcntl

RUN apk add --no-cache php7-dev alpine-sdk curl-dev openssl-dev \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb \
    && apk del --no-cache php7-dev alpine-sdk curl-dev openssl-dev

RUN apk add --no-cache freetype libpng libjpeg-turbo freetype-dev libpng-dev libjpeg-turbo-dev && \
      docker-php-ext-configure gd \
        --with-gd \
        --with-freetype-dir=/usr/include/ \
        --with-png-dir=/usr/include/ \
        --with-jpeg-dir=/usr/include/ && \
      docker-php-ext-install gd && \
      apk del --no-cache freetype-dev libpng-dev libjpeg-turbo-dev


RUN apk add --no-cache libzip-dev \
    && docker-php-ext-configure zip --with-libzip \
    && docker-php-ext-install zip
#    && apk del --no-cache libzip-dev
# libzip required at runtime

RUN docker-php-ext-install pdo_mysql

#RUN apk del --no-cache php7-dev alpine-sdk

# install composer
COPY --from=composer_version /usr/bin/composer /usr/local/bin/composer

RUN apk add --no-cache php7-dev alpine-sdk curl-dev \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && echo "xdebug.remote_enable=1" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.remote_autostart=1" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.remote_port=9001" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.remote_handler=dbgp" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.remote_connect_back=1" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.idekey=PHPSTORM" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.remote_host=docker.for.mac.localhost" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && apk del --no-cache php7-dev alpine-sdk curl-dev


WORKDIR /app


COPY ./docker-php-entrypoint.sh /usr/local/bin/docker-php-entrypoint.sh
RUN chmod u+x /usr/local/bin/docker-php-entrypoint.sh
ENTRYPOINT ["/usr/local/bin/docker-php-entrypoint.sh"]
EXPOSE 9000
CMD ["php-fpm"]