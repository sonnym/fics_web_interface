#!/usr/bin/env bash

set -e

yum --assumeyes update

# system
if [[ ! $(command -v g++) ]]
then
  # system dependencies
  yum install --assumeyes httpd git supervisor gcc-c++ yum-plugin-ps

  # enable services
  systemctl enable httpd supervisord

  # open port 80
  firewall-cmd --zone=public --add-service=http --permanent && firewall-cmd --reload
fi

# manually compiled nodejs
if [[ ! $(command -v /usr/local/bin/node) ]]
then
  cd ~

  git clone --depth 1 --branch v0.12.0 git://github.com/joyent/node.git

  cd node

  ./configure
  make
  make install
fi

# application
if [ ! -d /srv/fics ]
then
  export PATH="/usr/local/bin:$PATH"

  # initial setup of directory
  mkdir -p /srv/fics
  git clone --depth 1 https://github.com/sonnym/fics_web_interface.git /srv/fics

  cd /srv/fics

  npm install --production --unsafe-perm

  chown -R apache:apache /srv/fics
fi

# setup httpd
if [[ -n /etc/httpd/conf.d/fics_web_interface.conf ]]
then
  rm /etc/httpd/conf.d/*

  cp /srv/fics/deploy/httpd.conf /etc/httpd/conf.d/fics_web_interface.conf
  chown root:root $_

  systemctl restart httpd
fi

# configure and start application web server
if [[ -n /etc/supervisord.d/fics_web_interface.ini ]]
then
  cp /srv/fics/deploy/supervisord.ini /etc/supervisord.d/fics_web_interface.ini
  chown root:root $_

  systemctl start supervisord
fi

# configure sshd
if [[ -n $(diff /srv/fics/deploy/sshd_config /etc/ssh/sshd_config) ]]
then
  cp /srv/fics/deploy/sshd_config /etc/ssh/sshd_config
  chown root:root /etc/ssh/sshd_config
  systemctl restart sshd
fi

# reboot as necessary
if [[ $(yum ps restarts | wc -l) -gt "3" ]]
then
  shutdown -r now
fi
