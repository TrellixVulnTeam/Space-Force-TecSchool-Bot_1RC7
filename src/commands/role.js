const { SlashCommandBuilder } = require("@discordjs/builders");
const {
    MessageEmbed,
    MessageButton,
    MessageSelectMenu,
    MessageActionRow,
    Permissions,
} = require("discord.js");
const path = require("path");
const fs = require("fs");
const general = require(path.join(__dirname, "../modules/general"));

async function button(interaction, value) {
    value = { value: value, id: "" };
    if (value.value === undefined) {
        await interaction.reply({
            content: "There was an error finding the role",
            ephemeral: true,
        });
        return;
    }
    interaction.guild.roles.cache.some((role) => {
        if (role.name == value.value) {
            value.id = role.id;
        }
    });
    if (
        interaction.member.roles.cache.some((role) => role.name == value.value)
    ) {
        interaction.member.roles.remove(value.id);
        await interaction.reply({
            content: "The " + value.value + " role has been removed",
            ephemeral: true,
        });
    } else {
        interaction.member.roles.add(value.id);
        await interaction.reply({
            content: "The " + value.value + " role has been added",
            ephemeral: true,
        });
    }
}

module.exports = {
    button,
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
        
        if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
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
                    console.log(err);
                }
                config = JSON.parse(config);
                for (let index = 0; index < roles.length; index++) {
                    btn = {
                        value: roles[index],
                        command: "role",
                    };
                    btn = JSON.stringify(btn);
                        option.push( new MessageButton()
                        .setCustomId(btn)
                        .setLabel(roles[index])
                        .setStyle("SUCCESS"));
                    }
                    const row = new MessageActionRow().addComponents(
                       option
                    );
                    const embed = new MessageEmbed()
                        .setColor(config.color)
                        .setTitle("Role editor")
                        .setDescription(
                            "Add and remove the roles listed below"
                        );

                    await interaction.reply({
                        ephemeral: false,
                        embeds: [embed],
                        components: [row],
                    });
                
            }
        } else {
            await interaction.reply({
                content: "You don not have permission to use this command",
                ephemeral: true,
            });
        }
    },
};
