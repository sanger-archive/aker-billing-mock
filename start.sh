#!/bin/bash
PROJECT_FOLDER=$1
PORT=3601

set -e

if [ -f $PROJECT_FOLDER/current/run.pid ]
then
  echo "Problem: run.pid file already exists. If the script is not already running, delete the pid file."
  exit 1
fi
npm install
node $PROJECT_FOLDER/current/app.js -c $PROJECT_FOLDER/shared/nginx-selfsigned.crt -k $PROJECT_FOLDER/shared/nginx-selfsigned.key -p $PORT > $PROJECT_FOLDER/current/log.txt 2>&1 &

echo $! > $PROJECT_FOLDER/current/run.pid
echo "OK"
