 #!/bin/sh

#sudo chmod 744 run.sh

while : ; do
  if ping -q -c 1 -W 1 google.com >/dev/null; then
    break
    echo true
  fi
done

sudo apt-get update && sudo apt-get upgrade -y
sudo git stash
git config pull.ff only
git pull https://github.com/UtCrypticiores/Space-Force-TecSchool-Bot.git
sudo chmod 744 /home/pi/Space-Force-TecSchool-Bot/run.sh