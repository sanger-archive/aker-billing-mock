#!/bin/bash
PROJECT_FOLDER=$1
PORT=3601

set -e

cd "`dirname $BASH_SOURCE`"

if [ -f ./run.pid ]
then
  echo "Problem: run.pid file already exists. If the script is not already running, delete the pid file."
  exit 1
fi

nohup node $PROJECT_FOLDER/current/app.js -c $PROJECT_FOLDER/shared/nginx-selfsigned.pem -k $PROJECT_FOLDER/shared/nginx-selfsigned.key -p $PORT > $PROJECT_FOLDER/current/log.txt 2>&1 &

echo $! > ./run.pid
echo "OK"
