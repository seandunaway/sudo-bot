#!/bin/sh

n="${1:-10}"

command="tail -n $n ~/www/topstep-chinese.txt"

if [ -n "$2" ]
then
    command="$command | grep -i $2"
fi

/bin/sh -c "$command"
