require("dotenv").config();
const fs = require("fs");
// const envFile = require("envFile");
const path = require("path");
const { env } = require("process");
const prompt = require("prompt-sync")({ sigint: true });
const error = require(path.join(__dirname, "./modules/error/error"));
const general = require(path.join(__dirname, "./modules/general"));

let config = { color: "#1275ff" };

async function run(client) {
    const Guilds = client.guilds.cache.map((guild) => guild.id);
    await makeFiles(Guilds);
    await envCheck();
}

async function makeFiles(Guilds) {
    if (
        !general.fileExists(
            path.join(__dirname, "./resources/guilds"),
            null,
            "folder"
        )
    ) {
        console.log(`${general.time}Made "./src/resources/guilds"`);
    }
    for (let index = 0; index < Guilds.length; index++) {
        if (
            !general.fileExists(
                path.join(__dirname, `./resources/guilds/${Guilds[index]}`),
                null,
                "folder"
            )
        ) {
            console.log(
                `${general.time}Made "./src/resources/guilds/${Guilds[index]}"`
            );
        }
        if (
            !general.fileExists(
                path.join(
                    __dirname,
                    `./resources/guilds/${Guilds[index]}/config.json`
                ),
                config,
                "json"
            )
        ) {
            console.log(
                `${general.time}Made "./src/resources/guilds/${Guilds[index]}/config.json"`
            );
        }
        makeTxtFile([
            `./resources/guilds/${Guilds[index]}/sassy.txt`,
            `./resources/guilds/${Guilds[index]}/swears.txt`,
            `./resources/guilds/${Guilds[index]}/quotes.txt`,
        ]);
    }
}

async function envCheck() {
    let env = [
        "TOKEN",
        "DISCORD_ID",
        "DISCORD_SECRET",
        "BOT_OWNER_ID",
        "PORT",
        "DISCORD_REDIRECT",
    ];
    let val = "";
    let conformation = "";
    let envString = "";
    let envFile;

    try {
        envFile = fs.readFileSync(path.join(__dirname, "../.env"), "utf-8");
    } catch (err) {
        error.error(1, err);
    }

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
            envFile = envFile.split("\n");
            for (let index = 0; index < envFile.length; index++) {
                let envLine;

                envLine = envFile[index].split("=");
                if (envLine[0] == [env[i]]) {
                    envFile.splice(i, 1);
                }
            }
            envFile.push(`${env[i]}="${val}"`);
            for (let index = 0; index < envFile.length; index++) {
                if (index == 0) {
                    envString = envString + envFile[index];
                } else {
                    envString = envString + `\n${envFile[index]}`;
                }
            }
            try {
                fs.writeFileSync(path.join(__dirname, "../.env"), envString);
            } catch (err) {
                error.error(1, err);
            }
        }
    }
    console.log("");
}

function makeTxtFile(paths) {
    for (let index = 0; index < paths.length; index++) {
        if (
            !general.fileExists(path.join(__dirname, paths[index]), "", "txt")
        ) {
            console.log(`${general.time}Made "./src${paths[index].slice(1)}"`);
        }
    }
}

module.exports = { run };
