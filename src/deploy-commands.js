require("dotenv").config();
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
//run();
function run() {
	let config = fs.readFileSync("./src/config/config.json");
	config = JSON.parse(config);
	let guildId = config.guildId;
	const commands = [];
	const commandFiles = fs
		.readdirSync("./src/commands")
		.filter((file) => file.endsWith(".js"));

	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.push(command.data.toJSON());
	}
	const rest = new REST({ version: "9" }).setToken(token);

	(async () => {
		for (let index = 0; index < guildId.length; index++) {
			try {
				console.log("Started refreshing application (/) commands.");
				await rest.put(
					Routes.applicationGuildCommands(clientId, guildId[index]),
					{
						body: commands,
					}
				);
				console.log("Successfully reloaded application (/) commands.");
			} catch (error) {
				console.error(error);
			}
		}
	})();
}
module.exports = { run };
