const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const fs = require("fs");
const path = require("path");
const general = require(path.join(__dirname, "../modules/general"));

async function button(interaction) {
    let pollPath = path.join(
        __dirname,
        `../config/polls/${interaction.guild.id}.json`
    );
    let json;
    let fail = `json has failed to be added`;
    let id = JSON.parse(interaction.customId);
    let value = JSON.parse(interaction.customId);
    let test = false;

    id = id.id;
    value = value.value;
    try {
        json = fs.readFileSync(pollPath);
    } catch (err) {
        console.log(fail);
    }
    json = JSON.parse(json);
    for (let index = 0; index < json.commands.poll[id].user.length; index++) {
        if (json.commands.poll[id].user[index].id == interaction.user.id) {
            json.commands.poll[id].user[index].value = value;
            test = true;
        }
    }
    if (!test) {
        json.commands.poll[id].user.push({
            id: interaction.user.id,
            value: value,
        });
    }
    json = JSON.stringify(json, null, 4);
    try {
        fs.writeFileSync(pollPath, json);
    } catch (err) {
        console.log(fail);
    }
    await interaction.reply({
        content: "Your vote has been cast or updated",
        ephemeral: true,
    });
}

function makeId(length) {
    let id = "";
    let R;
    for (let index = 0; index < length; index++) {
        R = Math.floor(Math.random() * 9);
        id = id + R;
    }
    return id;
}

function formatData(json, index) {
    let idArray;
    let count = [];
    let msg = ``;

    if (index > 0) {
        msg = msg + `-----------------------\n`;
    }
    idArray = Object.keys(json.commands.poll);
    msg =
        msg +
        `Header: ${json.commands.poll[idArray[index]].header}\nBody: ${
            json.commands.poll[idArray[index]].body
        }\n`;
    for (
        let i = 0;
        i < json.commands.poll[idArray[index]].options.length;
        i++
    ) {
        count[json.commands.poll[idArray[index]].options[i]] = 0;
        for (
            let loop = 0;
            loop < json.commands.poll[idArray[index]].user.length;
            loop++
        ) {
            if (
                json.commands.poll[idArray[index]].user[loop].value ==
                json.commands.poll[idArray[index]].options[i]
            ) {
                count[json.commands.poll[idArray[index]].options[i]] =
                    count[json.commands.poll[idArray[index]].options[i]] + 1;
            }
        }
        msg =
            msg +
            `${json.commands.poll[idArray[index]].options[i]}: ${
                count[json.commands.poll[idArray[index]].options[i]]
            }\n`;
    }
    return msg;
}

module.exports = {
    button,
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Makes a poll")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("make")
                .setDescription("Makes a poll")
                .addStringOption((option) =>
                    option
                        .setName("options")
                        .setDescription("poll options separated by spaces")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("header")
                        .setDescription("the header of the poll")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("body")
                        .setDescription("The body of the poll")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("remove")
                .setDescription("removes a poll")
                .addStringOption((option) =>
                    option
                        .setName("poll")
                        .setDescription("name of the poll")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("results")
                .setDescription("gives the results of poll(s)")
                .addStringOption((option) =>
                    option
                        .setName("poll")
                        .setDescription("name of the poll")
                        .setRequired(false)
                )
        ),

    async execute(interaction, client) {
        let pollPath = path.join(
            __dirname,
            `../config/polls/${interaction.guild.id}.json`
        );
        switch (interaction.options.getSubcommand()) {
            case "make":
                let config;
                let buttonRaw = [];
                let id = makeId(10);
                let options = interaction.options.getString("options");
                options = options.split(" ");
                let data = {
                    header: interaction.options.getString("header"),
                    body: interaction.options.getString("body"),
                    image: "",
                    options: options,
                };
                let json = {
                    [id]: {
                        header: data.header,
                        body: data.body,
                        options: data.options,
                    },
                };
                let fail = `json has failed to be added`;
                let jsonFile;
                let idArray;
                let sent;

                if (!general.checkForDuplicates(options)) {
                    if (!fs.existsSync(pollPath)) {
                        fs.writeFileSync(
                            pollPath,
                            JSON.stringify({
                                commands: {
                                    poll: {},
                                },
                            })
                        );
                    }
                    try {
                        config = fs.readFileSync(
                            path.join(__dirname, "../config/config.json")
                        );
                    } catch (err) {
                        console.log(fail);
                    }
                    try {
                        jsonFile = fs.readFileSync(pollPath);
                    } catch (err) {
                        console.log(fail);
                    }
                    jsonFile = JSON.parse(jsonFile);
                    config = JSON.parse(config);
                    idArray = Object.keys(jsonFile.commands.poll);
                    for (let index = 0; index < idArray.length; index++) {
                        if (
                            jsonFile.commands.poll[idArray[index]].header ==
                            data.header
                        ) {
                            await interaction.reply({
                                content:
                                    "There is already a poll with this name",
                                ephemeral: true,
                            });
                            return;
                        }
                    }
                    for (let index = 0; index < data.options.length; index++) {
                        btn = {
                            id: id,
                            value: data.options[index],
                            command: "poll",
                        };
                        btn = JSON.stringify(btn);
                        buttonRaw.push(
                            new MessageButton()
                                .setCustomId(btn)
                                .setLabel(data.options[index])
                                .setStyle("PRIMARY")
                        );
                    }
                    jsonFile.commands.poll[id] = json[id];
                    jsonFile.commands.poll[id].user = [];

                    const embed = new MessageEmbed()
                        .setColor(config.color)
                        .setTitle(data.header)
                        .setDescription(data.body)
                        .setThumbnail(data.image)
                        .setTimestamp();
                    const buttons = new MessageActionRow().addComponents(
                        buttonRaw
                    );

                    await interaction.reply({
                        ephemeral: false,
                        embeds: [embed],
                        components: [buttons],
                    });
                    sent = await interaction.fetchReply();
                    jsonFile.commands.poll[id].channelId = sent.channelId;
                    jsonFile.commands.poll[id].messageId = sent.id;
                    jsonFile = JSON.stringify(jsonFile, null, 4);
                    try {
                        fs.writeFileSync(pollPath, jsonFile);
                    } catch (err) {
                        console.log(fail);
                    }
                } else {
                    await interaction.reply({
                        content: "Some of the options are the same",
                        ephemeral: true,
                    });
                }
                break;
            case "remove":
                let jsonResults;
                let pollId;
                let channelId;
                let messageId;

                if (fs.existsSync(pollPath)) {
                    try {
                        jsonResults = fs.readFileSync(pollPath);
                    } catch (err) {
                        console.log(err);
                        await interaction.reply({
                            content: "there was an error reading the file",
                            ephemeral: true,
                        });
                    }
                    jsonResults = JSON.parse(jsonResults);
                    pollId = Object.keys(jsonResults.commands.poll);
                    for (let index = 0; index < pollId.length; index++) {
                        if (
                            jsonResults.commands.poll[pollId[index]].header ==
                            interaction.options.getString("poll")
                        ) {
                            messageId =
                                jsonResults.commands.poll[pollId[index]]
                                    .messageId;
                            channelId =
                                jsonResults.commands.poll[pollId[index]]
                                    .channelId;
                            client.channels.fetch(channelId).then((channel) => {
                                channel.messages.delete(messageId);
                            });
                            delete jsonResults.commands.poll[pollId[index]];
                            jsonResults = JSON.stringify(jsonResults, null, 4);
                            try {
                                fs.writeFileSync(pollPath, jsonResults);
                            } catch (err) {
                                console.log(fail);
                            }
                            await interaction.reply({
                                content: `${interaction.options.getString(
                                    "poll"
                                )} has been removed`,
                                ephemeral: true,
                            });
                        } else {
                            await interaction.reply({
                                content: `${interaction.options.getString(
                                    "poll"
                                )} is not a poll`,
                                ephemeral: true,
                            });
                        }
                    }
                }
                break;
            case "results":
                let results;
                let msg = "";
                let idArrays;
                if (fs.existsSync(pollPath)) {
                    try {
                        results = fs.readFileSync(pollPath);
                    } catch (err) {
                        console.log(err);
                        await interaction.reply({
                            content: "there was an error reading the file",
                            ephemeral: true,
                        });
                    }
                    results = JSON.parse(results);
                    idArrays = Object.keys(results.commands.poll);
                    for (let index = 0; index < idArrays.length; index++) {
                        if (
                            interaction.options.getString("poll") == null ||
                            interaction.options.getString("poll") ==
                                undefined ||
                            interaction.options.getString("poll") == ""
                        ) {
                            msg = msg + formatData(results, index);
                        } else if (
                            results.commands.poll[idArrays[index]].header ==
                            interaction.options.getString("poll")
                        ) {
                            msg = msg + formatData(results, index) + "\n";
                        }
                    }
                    await interaction.reply({
                        content: msg,
                        ephemeral: false,
                    });
                } else {
                    await interaction.reply({
                        content: "no polls available",
                        ephemeral: false,
                    });
                }
                break;
        }
    },
};
