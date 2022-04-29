require("dotenv").config();
const token = process.env.TOKEN;
const fs = require("fs");
const path = require("path");
const { Client, Intents } = require("discord.js");
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
const role = require(path.join(__dirname, "./commands/role"));
const filter = require(path.join(__dirname, "./auto/swear"));
const random = require(path.join(__dirname, "./auto/random"));
const general = require(path.join(__dirname, "./modules/general"));

let package;
try {
    package = fs.readFileSync(path.join(__dirname, "../package.json"));
} catch (err) {
    console.log(general.time + err);
}
package = JSON.parse(package);

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
        switch (command.command) {
            case "poll":
                poll.button(interaction);
                break;
            case "role":
                role.button(interaction, command.value);
                break;
        }
    } else if (interaction.isSelectMenu) {
        let command = JSON.parse(interaction.values[0]);
        switch (command.command) {
            case "role":
                role.button(interaction, command.value);
                break;
        }
    }
});

client.on("messageCreate", (message) => {
    if (!message.author.bot) {
        if (message.content.split("")[0] == "!") {
            console.log(`${general.time}hi`);
        }
        if (false) {
            filter.swear(
                message.content,
                client,
                message,
                message.channelId,
                message.id
            );
        }
    }
});

client.once("ready", async () => {
    await command.run(client);
    //random.run();
    client.user.setPresence({
        activities: [{ name: "with my code", type: "PLAYING" }],
        status: "online",
    });
    console.log(
        `${general.time}${package.name} version ${package.version} is ready!`
    );
});

client.login(token);
