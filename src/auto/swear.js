require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

function swear() {
    let list  = fs.readFileSync(path.join(__dirname, "./resources/swears.txt")); 
    let config = fs.readFileSync(path.join(__dirname, "./config/config.json"));
    config = JSON.parse(config);
    list = list.split('\n')
}

module.exports = { swear };
