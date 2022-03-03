const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Gives general info"),
	async execute(interaction) {
		await interaction.reply("Visit the Github for all of the code\nhttps://github.com/UtCrypticiores/TSgt-Rock.git")
	},
};
