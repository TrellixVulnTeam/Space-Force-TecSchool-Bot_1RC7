const mongoose = require("mongoose");

const GuildSchema = new mongoose.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true },
    guilds: { type: Array, required: true },
    icon: { type: String, required: true },
});

const Guild = (module.exports = mongoose.model("Guild", GuildSchema));
