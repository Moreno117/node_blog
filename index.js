const express = require("express"),
  methodOverride = require("method-override"),
  LocalStrategy = require("passport-local"),
  bodyParser = require("body-parser"),
  cloudinary = require("cloudinary"),
  User = require("./models/user"),
  Post = require("./models/post"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  _ = require("lodash"),
  app = express();

const authRoutes = require("./routes/auth"),
  postRoutes = require("./routes/posts"),
  socialRoutes = require("./routes/social");

const APIS = require("./util");

// Helper for parse HTML
app.locals.htmlParsed = html => _.escape(html).replace(/\n/g, "<br>");
// Use static assets
app.use(express.static("public"));
// Setting up Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Setting up UPDATE method-override
app.use(methodOverride("_method"));

// Connect local DB
var url = process.env.DATABASEURL || "mongodb://localhost:27017/node-blog";
mongoose.connect(url);

// Setting up cloudinanry
cloudinary.config(APIS.CLOUDINARY);

// Passport configuration
app.use(
  require("express-session")({
    secret: "Blog of the year 2018",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Spread id on the routes
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", authRoutes);
app.use("/post", postRoutes);
app.use("/social", socialRoutes);

app.get("/blog", (req, res) => {
  Post.paginate({}, { page: 1, limit: 3 }, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      const meta = {
        total: posts.total,
        limit: posts.limit,
        page: posts.page,
        pages: posts.pages,
        nextPage: 1
      };
      res.render("blog/blog.ejs", { posts: posts.docs, meta: meta });
    }
  });
});

app.get("/lastPost", (req, res) => {
  var { page, total } = req.query;
  var nextPage;

  if (Number(page) === Number(total)) {
    nextPage = 1;
  } else if (Number(page) >= 1 && Number(page) < Number(total)) {
    nextPage = Number(page) + 1;
  }

  Post.paginate({}, { page: nextPage, limit: 3 }, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      const meta = {
        total: posts.total,
        limit: posts.limit,
        page: posts.page,
        pages: posts.pages,
        nextPage: nextPage
      };
      res.json({
        meta: meta,
        posts: posts.docs
      });
    }
  });
});

app.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log("App listen on port 3000");
});
