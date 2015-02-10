#!/usr/bin/env bash

set -e

# system
if [[ ! $(command -v g++) ]]
then
  # system dependencies
  yum install --assumeyes httpd git supervisor gcc-c++

  # enable services
  systemctl enable httpd supervisord
  systemctl start httpd supervisord

  # open port 80
  firewall-cmd --zone=public --add-service=http --permanent && firewall-cmd --reload
fi

# swap file for compiling python binaries
if [[ -n /swapfile ]]
then
  dd if=/dev/zero of=/swapfile bs=1024 count=512k
  mkswap /swapfile
  swapon /swapfile

  echo '/swapfile none swap sw  0 0' >> /etc/fstab

  echo 10 > /proc/sys/vm/swappiness
  echo vm.swappiness = 10 >> /etc/sysctl.conf

  chown root:root /swapfile
  chmod 0600 /swapfile
fi

# manually compiled nodejs
if [[ ! $(command -v node) ]]
then
  cd ~

  git clone --depth 1 --branch v0.12.0 git://github.com/joyent/node.git

  cd node

  ./configure
  make
  make install

  export PATH="/usr/local/bin:$PATH"
fi

# application
if ! [ -L /srv/fics ]
then
  # initial setup of directory
  mkdir -p /srv/fics
  git clone --depth 1 https://github.com/sonnym/fics_web_interface.git /srv/fics

  cd /srv/fics
  /usr/local/bin/npm install

  chown -R apache:apache /srv/fics
fi

# setup httpd
if [[ -n /etc/httpd/conf.d/fics.conf ]]
then
  rm /etc/httpd/conf.d/*.conf
fi

# configure sshd
cp /srv/fics/deploy/sshd_config /etc/ssh/sshd_config
chown root:root /etc/ssh/sshd_config
systemctl restart sshd
