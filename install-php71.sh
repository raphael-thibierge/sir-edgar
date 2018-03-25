# export missing locale
export LC_ALL="UTF-8"

# install repository
sudo apt-get install software-properties-common

# add php7 repository
sudo add-apt-repository ppa:ondrej/php -y

#if probleme with GPG key not founf :
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 4F4EA0AAE5267A6C

sudo apt-get update

#install php7 packages
sudo apt-get install -y php7.1-fpm php7.1-mysql php7.1-curl php7.1-gd php7.1-json php7.1-mcrypt php7.1-opcache php7.1-xml php7.1-mbstring php7.1-dev php7.1-intl php7.1-zip php7.1-gd php7.1-mongodb unzip mongodb

# restart php-fpm
sudo service php7.1-fpm restart

# install composer
sudo apt-get install composer