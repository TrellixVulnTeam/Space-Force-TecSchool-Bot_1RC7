const router = require("express").Router();
const passport = require("passport");
require("dotenv").config();

router.get("/", (req, res) => {
    let url = req.query.url;
    let fail = req.query.fail;
    if (url == undefined) {
        url = "/";
    }
    if (fail == "true") {
        fail = true;
    } else if (fail == undefined || fail == "false") {
        fail = false;
    }
    res.render("login", {
        fail: fail,
        url: url,
    });
});

router.get("/auth", passport.authenticate("discord"));

router.get(
    "/auth/redirect",
    passport.authenticate("discord", {
        failureRedirect: "/login?fail=true",
    }),
    (req, res) => {
        res.redirect("/");
    }
);

router.get("/callback", isAuthorized, (req, res) => {
    console.log(req.user);
    res.redirect("/");
});

router.get("/settings/:guildId", isAuthorized, (req, res) => {
    res.sendStatus(200);
});

function isAuthorized(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect("/login?fail=true");
    }
}

module.exports = router;
