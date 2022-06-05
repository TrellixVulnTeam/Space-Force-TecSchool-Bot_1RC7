require("dotenv").config();
const token = process.env.TOKEN;
const fs = require("fs");
const path = require("path");
const express = require("express");
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3010;
const passport = require("passport");
const discordStrategy = require("./strategies/discord");
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
const setup = require(path.join(__dirname, "./setup"));
const poll = require(path.join(__dirname, "./commands/poll"));
const role = require(path.join(__dirname, "./commands/role"));
const filter = require(path.join(__dirname, "./auto/swear"));
const random = require(path.join(__dirname, "./auto/random"));
const general = require(path.join(__dirname, "./modules/general"));
const error = require(path.join(__dirname, "./modules/error/error"));

let package;

try {
    package = fs.readFileSync(path.join(__dirname, "../package.json"));
} catch (err) {
    error.error(1, err);
}
package = JSON.parse(package);

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (command) {
            try {
                await command.execute(interaction, client);
            } catch (err) {
                error.error(1, err);
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

client.on("guildCreate", async (guild) => {
    await command.run(client);
});

client.once("ready", async () => {
    await setup.run(client);
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

//routes
const homeRoute = require(path.join(__dirname, "./routes/home"));
const aboutRoute = require(path.join(__dirname, "./routes/about"));
const loginRoute = require(path.join(__dirname, "./routes/login"));
const newsRoute = require(path.join(__dirname, "./routes/news"));

//cookies
app.use(
    session({
        resave: true,
        secret: "Polaris",
        cookie: {
            maxAge: 60000 * 60 * 24,
        },
        saveUninitialized: true,
        name: "login",
    })
);

//html setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

//passport
app.use(passport.initialize());
app.use(passport.session());

//middleware routes
app.use("/", homeRoute);
app.use("/about", aboutRoute);
app.use("/login", loginRoute);
app.use("/news", newsRoute);

app.listen(PORT, () => {
    console.log(`${general.time}Now listening to requests on port ${PORT}`);
    console.log(`${general.time}http://localhost:${PORT}/`);
});
