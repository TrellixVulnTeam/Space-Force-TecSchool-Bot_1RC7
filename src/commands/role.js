const { SlashCommandBuilder } = require("@discordjs/builders");
const {
    MessageEmbed,
    MessageButton,
    MessageSelectMenu,
    MessageActionRow,
} = require("discord.js");
const path = require("path");
const fs = require("fs");
const general = require(path.join(__dirname, "../modules/general"));

async function button(interaction) {
    let config;
    let value = JSON.parse(interaction.customId);

    value = value.value;
    try {
        config = fs.readFileSync(path.join(__dirname, "../config/config.json"));
    } catch (err) {
        console.log(fail);
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("role")
        .setDescription("gives the ability for users to give themselves roles")
        .addStringOption((option) =>
            option
                .setName("roles")
                .setDescription("Role name(s)")
                .setRequired(true)
        ),
    async execute(interaction, client) {
        let roles = interaction.options.getString("roles");
        let guildRoles = [];
        let option = [];
        let test = false;
        let btn;
        let config;

        roles = roles.split(" ");
        interaction.member.guild.roles.cache.some((role) => {
            guildRoles.push(role.name);
        });
        if (general.checkForDuplicates(roles)) {
            await interaction.reply({
                content: "Some of the roles are the same",
                ephemeral: true,
            });
        } else if (general.checkForDuplicates(guildRoles)) {
            await interaction.reply({
                content: "Some of the roles in the server are the same",
                ephemeral: true,
            });
        } else {
            for (let index = 0; index < roles.length; index++) {
                for (let i = 0; i < guildRoles.length; i++) {
                    if (roles[index] == guildRoles[i]) {
                        test = true;
                    }
                }
                if (!test) {
                    await interaction.reply({
                        content:
                            "There is a role that is not in this server (Caps matter)",
                        ephemeral: true,
                    });
                    return;
                }
            }
            try {
                config = fs.readFileSync(
                    path.join(__dirname, "../config/config.json")
                );
            } catch (err) {
                console.log(fail);
            }
            config = JSON.parse(config);
            if (roles.length == 1) {
                btn = {
                    value: roles[0],
                    command: "role",
                };
                btn = JSON.stringify(btn);

                const row = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(btn)
                        .setLabel(roles[0])
                        .setStyle("PRIMARY")
                );
                const embed = new MessageEmbed()
                    .setColor(config.color)
                    .setTitle("Some title")
                    .setDescription("Some description here");

                await interaction.reply({
                    ephemeral: false,
                    embeds: [embed],
                    components: [row],
                });
            } else {
                for (let index = 0; index < roles.length; index++) {
                    btn = {
                        value: roles[index],
                        command: "roles",
                    };
                    btn = JSON.stringify(btn);
                    option.push({
                        label: roles[index],
                        description: "This is also a description",
                        value: btn,
                    });
                }

                const row = new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId("select")
                        .setPlaceholder("Nothing selected")
                        .addOptions(option)
                );
                const embed = new MessageEmbed()
                    .setColor(config.color)
                    .setTitle("Some title")
                    .setDescription("Some description here");

                await interaction.reply({
                    ephemeral: false,
                    embeds: [embed],
                    components: [row],
                });
            }
        }
    },
};
