#!/usr/bin/env bash

set -e

if [ "$#" -ne 1 ]
then
  echo "Usage: "$0" ENVIRONMENT"
  exit 1
fi

if [[ "$1" == "testing" ]]
then
  USER="vagrant"
  HOST=$(vagrant ssh-config testing | grep HostName | awk '{ print $2 }')
  PORT=$(vagrant ssh-config testing | grep Port | awk '{ print $2 }')

  OPTS="-i .vagrant/machines/testing/virtualbox/private_key"
fi

if [[ "$1" == "production" ]]
then
  USER="sonny"
  HOST="fics.bughou.se"
  PORT="22"
fi

SSH_OPTS="$USER@$HOST $OPTS -p $PORT "
SCP_OPTS="-r $OPTS -P $PORT"

./node_modules/.bin/gulp build

echo

ssh $SSH_OPTS "cd /srv/fics && sudo git fetch && sudo git reset --hard origin/master"
ssh $SSH_OPTS "sudo chown -R $USER /srv/fics"

scp $SCP_OPTS public "$USER@$HOST:/srv/fics/"

ssh $SSH_OPTS "sudo chown -R apache:apache /srv/fics/public"
ssh $SSH_OPTS "sudo supervisorctl restart all"
