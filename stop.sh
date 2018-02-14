#!/bin/bash
PROJECT_FOLDER=$1
set -e

cd "`dirname $BASH_SOURCE`"

if [ ! -f $PROJECT_FOLDER/current/run.pid ]
then
  echo "Problem: No pid file found."
  exit 1
fi

kill `cat $PROJECT_FOLDER/current/run.pid`
rm $PROJECT_FOLDER/current/run.pid
echo "OK"
