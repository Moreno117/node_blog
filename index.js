var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Use static assets
app.use(express.static("public"));

// Connect local DB
mongoose.connect("mongodb://localhost:27017/node-blog");

// Setting up Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('landing.ejs');
});

app.get('/blog', (req, res) => {
    res.render('blog.ejs');
})

app.listen(3000, () => {
    console.log('App listen on port 3000');
})