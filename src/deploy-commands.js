require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const token = process.env.TOKEN;
const clientId = process.env.DISCORD_ID;
const general = require(path.join(__dirname, "./modules/general"));
const error = require(path.join(__dirname, "./modules/error/error"));

let config;

try {
    config = fs.readFileSync(path.join(__dirname, "resources/config.json"));
} catch (err) {
    error.error(err);
}

async function run(client) {
    const Guilds = client.guilds.cache.map((guild) => guild.id);
    const commands = [];
    const commandFiles = fs
        .readdirSync(path.join(__dirname, "./commands"))
        .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(path.join(__dirname, `./commands/${file}`));
        commands.push(command.data.toJSON());
    }
    const rest = new REST({ version: "9" }).setToken(token);
    general.fileExists(
        path.join(__dirname, "./resources/guilds"),
        null,
        "folder"
    );

    for (let index = 0; index < Guilds.length; index++) {
        try {
            console.log(
                `${general.time}Started refreshing application(${Guilds[index]}) (/) commands.`
            );
            await rest.put(
                Routes.applicationGuildCommands(clientId, Guilds[index]),
                {
                    body: commands,
                }
            );
            console.log(
                `${general.time}Successfully reloaded application(${Guilds[index]}) (/) commands.`
            );
        } catch (err) {
            error.error(err);
        }
        general.fileExists(
            path.join(__dirname, `./resources/guilds/${Guilds[index]}`),
            null,
            "folder"
        );

        general.fileExists(
            path.join(
                __dirname,
                `./resources/guilds/${Guilds[index]}/config.json`
            ),
            config,
            "txt"
        );
        makeTxtFile([
            `./resources/guilds/${Guilds[index]}/sassy.txt`,
            `./resources/guilds/${Guilds[index]}/swears.txt`,
            `./resources/guilds/${Guilds[index]}/quotes.txt`,
        ]);
    }
    client.commands = new Collection();
    for (const file of commandFiles) {
        const command = require(path.join(__dirname, `./commands/${file}`));
        client.commands.set(command.data.name, command);
    }
}

function makeTxtFile(paths) {
    for (let index = 0; index < paths.length; index++) {
        general.fileExists(path.join(__dirname, paths[index]), "", "txt");
    }
}
module.exports = { run };
