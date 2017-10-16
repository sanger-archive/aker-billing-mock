#!/bin/bash

set -e

cd "`dirname $BASH_SOURCE`"

if [ ! -f ./run.pid ]
then
  echo "Problem: No pid file found."
  exit 1
fi

kill `cat ./run.pid`
rm ./run.pid
echo "OK"
