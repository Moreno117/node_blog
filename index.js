var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var _ = require("lodash");
var User = require("./models/user");
var Post = require("./models/post");

var authRoutes = require("./routes/auth"),
    postRoutes = require("./routes/posts");

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

app.use("/", authRoutes);
app.use("/post", postRoutes);

app.get('/blog', (req, res) => {
    Post.find({}, (err, posts) => {
        if(err){
            console.log(err);
        } else {
            res.render('blog/blog.ejs', { posts: posts });
        }
    });
});

app.listen(3000, () => {
    console.log('App listen on port 3000');
})