var express = require("express");
var app = express();
var bodyParser = require("body-parser");

// mongoose.connect("mongodb://localhost:27017/node-blog");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.render('landing.ejs');
});

app.listen(3000, () => {
    console.log('App listen on port 3000');
})