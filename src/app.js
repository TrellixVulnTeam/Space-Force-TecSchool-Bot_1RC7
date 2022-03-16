require("dotenv").config();
const fs = require("fs");
const path = require("path")
const { Client, Collection, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const command = require(path.join(__dirname, "./deploy-commands"));
const setup = require("./setup");
//setup.run();
command.run();
client.commands = new Collection();
const token = process.env.TOKEN;

const commandFiles = fs
	.readdirSync(path.join(__dirname,"./src/commands"))
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(path.join(__dirname,`./commands/${file}`));
	client.commands.set(command.data.name, command);
}


client.on("interactionCreate", async (interaction) => {
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (command) {
			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			}
		}
	}
});

client.once("ready",async () => {
	// const Guilds = client.guilds.cache.map((guild) => guild);
	// for (let index = 0; index < Guilds.length; index++) {

		
	
	// const all_fetchedCommands = await Guilds[index].commands.fetch();
	// console.log(all_fetchedCommands)
	// const pingCommand = all_fetchedCommands.find(command => command.name === 'ping');
	// const pingCommandId = pingCommand.permissions.commandId; 

	// const pingCommandName = pingCommand.permissions.manager.name;
	//await Guilds[index].commands.permissions.set({ fullPermissions });
//}
	console.log("Ready!");
});

client.login(token);
