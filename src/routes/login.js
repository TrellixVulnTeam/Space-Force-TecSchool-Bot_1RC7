const router = require("express").Router();

const passport = require("passport");

router.get("/", (req, res) => {
    res.render("login", {
        fail: false,
    });
});

router.get("/failure", (req, res) => {
    res.render("login", {
        fail: true,
    });
});
router.get("/discord/callback", (req, res) => {
    res.render("login", {
    });
});
module.exports = router;
