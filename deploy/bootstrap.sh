#!/usr/bin/env bash

set -e

# system
if [[ ! $(command -v git) ]]
then
  # system dependencies
  yum install --assumeyes httpd git supervisor

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

# application
if ! [ -L /srv/fics ]
then
  # initial setup of directory
  mkdir -p /srv/fics
  git clone --depth 1 https://github.com/sonnym/fics_web_interface.git /srv/fics

  cd /srv/fics
  npm install

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
