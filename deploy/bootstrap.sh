#!/usr/bin/env bash

set -e

yum --assumeyes update

# system
if [[ ! $(command -v g++) ]]
then
  # system dependencies
  yum remove ssmtp
  yum install --assumeyes make httpd mod_ssl git supervisor gcc-c++ yum-plugin-ps logwatch postfix

  # enable services
  systemctl enable httpd supervisord postfix
  systemctl start postfix

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

  setsebool -P httpd_can_network_connect 1

  chown -R apache:apache /srv
  chcon -R --type=httpd_sys_rw_content_t /srv
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

# ssl directory
if [ ! -d /srv/ssl/private ]
then
  mkdir -p /srv/ssl/{certs,private}
fi

# configure sshd
if [[ -n $(diff /srv/fics/deploy/sshd_config /etc/ssh/sshd_config) ]]
then
  cp /srv/fics/deploy/sshd_config /etc/ssh/sshd_config
  chown root:root $_

  systemctl restart sshd
fi

# configure logwatch
if [[ -n $(diff /srv/fics/deploy/logwatch.conf /etc/logwatch/conf/logwatch.conf) ]]
then
  cp /srv/fics/deploy/logwatch.conf /etc/logwatch/conf/logwatch.conf
  chown root:root $_
fi

# reboot as necessary
if [[ $(yum ps restarts | wc -l) -gt "3" ]]
then
  shutdown -r now
fi
