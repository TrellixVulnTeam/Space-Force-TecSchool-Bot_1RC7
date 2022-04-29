require("dotenv").config();
const fs = require("fs");
const path = require("path");

function swear(message, client, msg, channelId, messageId) {
    let list;
    let sassy;
    let R;

    try {
        list = fs.readFileSync(
            path.join(__dirname, "../resources/swears.txt"),
            "utf-8"
        );
    } catch (err) {
        console.log(general.time + err);
    }
    try {
        sassy = fs.readFileSync(
            path.join(__dirname, "../resources/sassy.txt"),
            "utf-8"
        );
    } catch (err) {
        console.log(general.time + err);
    }
    message = message.toLowerCase();
    list = list.toLowerCase();
    sassy = sassy.split("\n");
    message = message.split(" ");
    list = list.split("\n");
    R = Math.floor(Math.random() * sassy.length);
    for (let index = 0; index < list.length; index++) {
        for (let i = 0; i < message.length; i++) {
            if (message[i] == list[index]) {
                client.channels.fetch(channelId).then((channel) => {
                    channel.messages.delete(messageId);
                });
                msg.channel.send({
                    content: "<@" + msg.author.id + "> " + sassy[R],
                });
                return;
            }
        }
    }
}

module.exports = { swear };
