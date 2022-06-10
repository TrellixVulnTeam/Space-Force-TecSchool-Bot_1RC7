const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true },
    guilds: { type: Array, required: true },
    icon: { type: String, required: true },
});

const User = (module.exports = mongoose.model("User", UserSchema));
