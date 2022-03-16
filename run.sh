#!/bin/sh

while : ; do
  if ping -q -c 1 -W 1 google.com >/dev/null; then
    break
    echo true
  fi
done

cd Space-Force-TecSchool-Bot
git config pull.ff only
git pull https://github.com/UtCrypticiores/Space-Force-TecSchool-Bot.git
su pi -c 'node /home/pi/Space-Force-TecSchool-Bot/src/app.js < /dev/null &'