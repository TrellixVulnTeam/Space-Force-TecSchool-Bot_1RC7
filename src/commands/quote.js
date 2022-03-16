const { SlashCommandBuilder } = require("@discordjs/builders");
const { Console } = require("console");
const fs = require("fs");
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
	async execute(interaction) {
		let path = path.join(__dirname,`./src/config/quotes/${interaction.guild.id}.txt`);
		if (interaction.options.getSubcommand() === "add") {
			let quote = interaction.options.getString("quote");
			let success = `${quote} has been added`;
			let fail = `${quote} has failed to be added`;
			if (fs.existsSync(path)) {
				if (fs.readFileSync(path, "utf-8") == "") {
					try {
						fs.appendFileSync(path, quote);
					} catch (err) {
						reply(fail);
					}
					reply(success);
				} else {
					try {
						fs.appendFileSync(path, `\n${quote}`);
					} catch (err) {
						reply(fail);
					}
					reply(success);
				}
			} else {
				try {
					fs.writeFileSync(path, quote);
				} catch (err) {
					reply(fail);
				}
				reply(success);
			}
		} else if (interaction.options.getSubcommand() === "send") {
			if (fs.existsSync(path) && fs.readFileSync(path, "utf-8") != "") {
				let quotes = [];
				let text = fs.readFileSync(path, "utf-8");
				quotes = text.split("\n");
				let R = Math.floor(Math.random() * (quotes.length - 1 - 1)) + 1;
				console.log;
				reply(quotes[R]);
			} else {
				reply("there are no quotes available");
			}
		}

		function reply(message) {
			interaction.reply(message);

		}
	},
};
