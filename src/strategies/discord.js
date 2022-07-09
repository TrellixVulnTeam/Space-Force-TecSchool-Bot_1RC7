const DiscordStrategy = require("passport-discord").Strategy;
require("dotenv").config();
const passport = require("passport");
const path = require("path");
const error = require(path.join(__dirname, "../modules/error/error"));
const DiscordUser = require("../models/user");

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await DiscordUser.findById(id);
        if (user) {
            done(null, user);
        }
    } catch (err) {
        error.error(2, err);
    }
});
try {
    passport.use(
        new DiscordStrategy(
            {
                clientID: process.env.DISCORD_ID,
                clientSecret: process.env.DISCORD_SECRET,
                callbackURL: process.env.DISCORD_REDIRECT,
                scope: ["identify", "guilds"],
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log(profile);
                const user = await DiscordUser.findOne({
                    id: profile.id,
                });

                if (user) {
                    if (
                        user.id == profile.id &&
                        user.username == profile.username &&
                        user.guilds == profile.guilds &&
                        user.icon == profile.avatar
                    ) {
                        done(null, user);
                    } else {
                        const updateUser = await DiscordUser.updateOne(
                            { id: profile.id },
                            {
                                id: profile.id,
                                username: profile.username,
                                guilds: profile.guilds,
                                icon: profile.avatar,
                            }
                        );
                        done(null, user);
                    }
                } else {
                    const newUser = await DiscordUser.create({
                        id: profile.id,
                        username: profile.username,
                        guilds: profile.guilds,
                        icon: profile.avatar,
                    });
                    const savedUser = await newUser.save();
                    done(null, savedUser);
                }
            }
        )
    );
} catch (err) {
    error.error(2, err);
    done(err, null);
}
