require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

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

    for (let index = 0; index < Guilds.length; index++) {
        try {
            console.log(
                `Started refreshing application(${Guilds[index]}) (/) commands.`
            );
            await rest.put(
                Routes.applicationGuildCommands(clientId, Guilds[index]),
                {
                    body: commands,
                }
            );
            console.log(
                `Successfully reloaded application(${Guilds[index]}) (/) commands.`
            );
        } catch (error) {
            console.error(error);
        }
    }
    client.commands = new Collection();
    for (const file of commandFiles) {
        const command = require(path.join(__dirname, `./commands/${file}`));
        client.commands.set(command.data.name, command);
    }
}
module.exports = { run };
