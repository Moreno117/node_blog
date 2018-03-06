var express = require("express");
    Post = require("../models/post");

const router = express.Router();

router.get("/new", isLoggedIn, (req, res) => {
    res.render("blog/new.ejs");
});

router.get("/:id", (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            console.log("There was an error", err)
        } else {
            res.render("blog/show.ejs", { post: post });
        }
    })
})

router.post("/", isLoggedIn, (req, res) => {
    const { title, image, content } = req.body;
    const resume = content.substring(0, 250);
    const userPost = {
        title: title,
        image: image,
        content: content,
        resume: resume
    }
    Post.create(userPost, (err, newPost) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blog")
        }
    });
});

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;