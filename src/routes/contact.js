const fetch = require("node-fetch");
const path = require("path");
const router = require("express").Router();

const error = require(path.join(__dirname, "../modules/error/error"));

router.get("/", (req, res) => {
    let settings = { method: "Get" };

    try {
        fetch(
            "https://discordapp.com/api/guilds/755216129919680603/widget.json",
            settings
        )
            .then((res) => res.json())
            .then((discordJson) => {
                discordJson.members = discordJson.members.slice(0, 10);
                if (discordJson.presence_count >= 99) {
                    discordJson.presence_count = "100+";
                }
                fetch(
                    "https://api.github.com/repos/UtCrypticiores/Polaris",
                    settings
                )
                    .then((res) => res.json())
                    .then((gitJson) => {
                        fetch(
                            "https://api.github.com/repos/UtCrypticiores/Polaris/contributors",
                            settings
                        )
                            .then((res) => res.json())
                            .then((gitContributorsJson) => {
                                (gitJson["contributors"] = gitContributorsJson),
                                    res.render("contact", {
                                        discordWidget: discordJson,
                                        gitWidget: gitJson,
                                    });
                            });
                    });
            });
    } catch (err) {
        error.error(1, err);
    }
});

module.exports = router;
