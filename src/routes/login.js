const router = require("express").Router();
const passport = require("passport");

router.get("/auth", passport.authenticate("discord"));
router.get(
    "/auth/redirect",
    passport.authenticate("discord", {
        failureRedirect: "/",
        successRedirect: "/callback",
    })
);

router.get("/", (req, res) => {
    const url = req.query.url;
    res.render("login", {
        fail: false,
        url: url,
    });
});
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
        res.redirect("/login");
    }
}

module.exports = router;
