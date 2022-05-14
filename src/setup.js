require("dotenv").config();
const fs = require("fs");
// const envfile = require("envfile");
const path = require("path");
const prompt = require("prompt-sync")({ sigint: true });
const general = require(path.join(__dirname, "./modules/general"));

async function run() {
    let env = [
        "TOKEN",
        "DISCORD_ID",
        "DISCORD_SECRET",
        "BOT_OWNER_ID",
        "PORT",
        "DISCORD_REDIRECT",
        "LLLL",
    ];
    let val = "";
    let conformation = "";

    //.env
    for (let i = 0; i < env.length; i++) {
        if (process.env[env[i]] == undefined || process.env[env[i]] == "") {
            while (val == "") {
                console.log(
                    `${general.time}Please input ${env[i]} for .env file`
                );
                val = prompt("> ");
                console.log(`${general.time}Conformation y/n`);
                conformation = prompt("> ");
                conformation = conformation.toLowerCase();
                if (conformation !== "y" && conformation !== "yes") {
                    val = "";
                }
            }
            //add to .env
        }
    }
    console.log("");
}

module.exports = { run };
