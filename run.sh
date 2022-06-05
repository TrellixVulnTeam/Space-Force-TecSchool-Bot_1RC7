#!/bin/sh

sudo apt-get update && sudo apt-get upgrade -y && sudo apt autoremove -y

sudo chmod 777 Space-Force-TecSchool-Bot

cd Space-Force-TecSchool-Bot 

sudo git stash
sudo git config pull.ff only
sudo git pull https://github.com/UtCrypticiores/Space-Force-TecSchool-Bot.git