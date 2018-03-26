
# install repository
sudo apt-get install software-properties-common

# add php7 repository
sudo add-apt-repository ppa:ondrej/php -y

#if probleme with GPG key not founf :
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 4F4EA0AAE5267A6C

#install php7 packages
sudo apt-get update
sudo apt-get install -y php7.2-fpm php7.2-mysql php7.2-curl php7.2-gd php7.2-json php7.2-mcrypt php7.2-opcache php7.2-xml php7.2-mbstring php7.2-dev php7.2-intl php7.2-zip php7.2-gd php7.2-mongodb unzip mongodb
sudo echo "extension = mongodb.so" >> /etc/php/7.2/fpm/php.ini
sudo echo "extension = mongodb.so" >> /etc/php/7.2/cli/php.ini

# restart php-fpm
sudo service php7.2-fpm restart

# install composer
sudo apt-get install composer