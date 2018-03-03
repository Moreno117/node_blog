var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Use static assets
app.use(express.static("public"));
// Setting up Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Connect local DB
mongoose.connect("mongodb://localhost:27017/node-blog");

var postSchema = new mongoose.Schema({
    title: String,
    image: String,
    content: String
});

var Post = mongoose.model("Post", postSchema);


app.get('/', (req, res) => {
    res.render('landing.ejs');
});

app.get('/blog', (req, res) => {
    Post.find({}, (err, posts) => {
        if(err){
            console.log(err);
        } else {
            res.render('blog.ejs', { posts: posts });
        }
    });
});

app.get("/post/new", (req, res) => {
    res.render("new.ejs");
});

app.get("/post/:id", (req, res) => {
    Post.findById(req.params.id, (err, postFound) => {
        if (err) {
            console.log("There was an error", err)
        } else {
            res.render("show.ejs", { postFound: postFound });
        }
    })
})

app.post("/post", (req,res) => {
    const { title, image, content } = req.body;
    const userPost = {
        title: title,
        image: image,
        content: content
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