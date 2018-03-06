var express = require("express"),
    passport = require("passport"),
    User = require("../models/user");

var router = express.Router();

// Landing Pages
router.get('/', (req, res) => {
    res.render('landing.ejs');
});

// =============
// Auth routes
// =============
router.get("/more/user", (req, res) => {
    res.render("auth/register.ejs")
});

router.post("/more/user", (req, res) => {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log("Error auth ", err);
            return res.render("auth/register.ejs");
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/blog")
            })
        }
    })
});

router.get("/login", (req, res) => {
    res.render("auth/login.ejs");
})

router.post("/login", passport.authenticate("local",
    { successRedirect: "/blog", failureRedirect: "/login" }),
    (req, res) => { });

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;