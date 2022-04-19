require("dotenv").config();
const token = process.env.TOKEN;
const fs = require("fs");
const path = require("path");
const { Client, Collection, Intents } = require("discord.js");
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
    ],
});
const command = require(path.join(__dirname, "./deploy-commands"));
const poll = require(path.join(__dirname, "./commands/poll"));
const filter = require(path.join(__dirname, "./auto/swear"));

command.run();
client.commands = new Collection();

const commandFiles = fs
    .readdirSync(path.join(__dirname, "./commands"))
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(path.join(__dirname, `./commands/${file}`));
    client.commands.set(command.data.name, command);
}

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (command) {
            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        }
    } else if (interaction.isButton()) {
        let command = JSON.parse(interaction.customId);

        command = command.command;
        switch (command) {
            case "poll":
                poll.button(interaction);
                break;
            case "role":
                break;
        }
    } else if (interaction.isSelectMenu) {
        console.log(interaction);
    }
});

client.on("messageCreate", (message) => {
    filter.swear(
        message.content,
        client,
        message,
        message.channelId,
        message.id
    );
});

client.once("ready", async () => {
    console.log("Ready!");
});

client.login(token);
