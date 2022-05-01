const { SlashCommandBuilder } = require("@discordjs/builders");
const path = require("path");
const fs = require("fs");
const error = require(path.join(__dirname, "../modules/error/error"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quote")
        .setDescription("Replies with a random quote")
        .addSubcommand((subcommand) =>
            subcommand.setName("send").setDescription("Sends a quote")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add")
                .setDescription("Adds a quote to the server")
                .addStringOption((option) =>
                    option
                        .setName("quote")
                        .setDescription("Add a Quote")
                        .setRequired(true)
                )
        ),
    async execute(interaction, client) {
        let configPath = path.join(
            __dirname,
            `../resources/guilds/${interaction.guild.id}/quotes.txt`
        );

        if (interaction.options.getSubcommand() === "add") {
            let quote = interaction.options.getString("quote");
            let success = `${quote} has been added`;
            let fail = `${quote} has failed to be added`;

            if (fs.readFileSync(configPath, "utf-8") == "") {
                try {
                    fs.appendFileSync(configPath, quote);
                } catch (err) {
                    error.error(1, err);
                    await interaction.reply(fail);
                }
                await interaction.reply(success);
            } else {
                try {
                    fs.appendFileSync(configPath, `\n${quote}`);
                } catch (err) {
                    error.error(1, err);
                    await interaction.reply(fail);
                }
                await interaction.reply(success);
            }
        } else if (interaction.options.getSubcommand() === "send") {
            if (fs.readFileSync(configPath, "utf-8") != "") {
                let quotes = [];
                let text = fs.readFileSync(configPath, "utf-8");
                let R;

                quotes = text.split("\n");
                R = Math.floor(Math.random() * quotes.length);
                console.log;
                await interaction.reply(quotes[R]);
            } else {
                await interaction.reply("there are no quotes available");
            }
        }
    },
};
