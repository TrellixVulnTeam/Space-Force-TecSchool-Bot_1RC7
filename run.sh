#!/bin/sh

while : ; do
  if ping -q -c 1 -W 1 google.com >/dev/null; then
    break
    echo true
  fi
done

sudo apt-get update && sudo apt-get upgrade -y
git config pull.ff only
git pull https://github.com/UtCrypticiores/Space-Force-TecSchool-Bot.git