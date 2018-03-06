var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var _ = require("lodash");
var User = require("./models/user");
var Post = require("./models/post");

var authRoutes = require("./routes/auth");

// Helper for parse HTML
app.locals.htmlParsed = html => _.escape(html).replace(/\n/g, '<br>');
// Use static assets
app.use(express.static("public"));
// Setting up Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Connect local DB
mongoose.connect("mongodb://localhost:27017/node-blog");

// Passport configuration
app.use(require("express-session")({
    secret: "Blog of the year 2018",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Spread id on the routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

app.use("/", authRoutes)

app.get('/blog', (req, res) => {
    Post.find({}, (err, posts) => {
        if(err){
            console.log(err);
        } else {
            res.render('blog/blog.ejs', { posts: posts });
        }
    });
});

app.get("/post/new", (req, res) => {
    res.render("blog/new.ejs");
});

app.get("/post/:id", (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            console.log("There was an error", err)
        } else {
            res.render("blog/show.ejs", { post: post });
        }
    })
})

app.post("/post", (req,res) => {
    const { title, image, content } = req.body;
    const resume = content.substring(0,250);
    const userPost = {
        title: title,
        image: image,
        content: content,
        resume: resume
    }
    Post.create(userPost, (err, newPost) => {
        if(err){
            console.log(err);
        }else {
            res.redirect("/blog")
        }
    });
});

app.listen(3000, () => {
    console.log('App listen on port 3000');
})