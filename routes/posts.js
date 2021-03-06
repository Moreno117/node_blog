var express = require("express"),
    Post = require("../models/post"),
    cloudinary = require("cloudinary"),
    multer = require("multer");

const router = express.Router();
const upload = multer({ dest: 'public/uploads' });

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

router.post("/", isLoggedIn, upload.single('upload'), (req, res) => {
    const { title, content } = req.body;
    const { filename } = req.file;
    const resume = content.substring(0, 250);
    //upload image
    cloudinary.uploader.upload(`public/uploads/${filename}`, (result) => {
        const imagePath = result.url;
        const userPost = {
            title: title,
            image: imagePath,
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
});

router.get("/:id/edit", isLoggedIn, (req,res) => {
    Post.findById(req.params.id, (error, postFound) => {
        res.render("blog/edit.ejs", { post:postFound });
    });
});

router.put("/:id", isLoggedIn, upload.single('imageUpdate'), (req, res) => {
    const { title, content } = req.body;
    const resume = content.substring(0 ,250);    
    if(req.file !== undefined){
        const { filename } = req.file;
        cloudinary.uploader.upload(`public/uploads/${filename}`, (result) => {
            const imagePath = result.url;
            const userPostUpdated = {
                title: title,
                image: imagePath,
                content: content,
                resume: resume
            };
            Post.findByIdAndUpdate(req.params.id, userPostUpdated, (error, postUpdated) => {
                if(error){
                    console.log("There was an error ", error);
                    res.redirect("/blog");
                } else {
                    res.redirect(`/post/${postUpdated._id}`);
                }
            });
        });
    } else {
        const userPostUpdated = {
            title: title,
            content: content,
            resume: resume
        };
        Post.findByIdAndUpdate(req.params.id, userPostUpdated, (error, postUpdated) => {
            if(error){
                console.log("There was an error ", error);
                res.redirect("/blog");
            } else {
                res.redirect(`/post/${postUpdated._id}`);
            }
        });
    }
});

router.delete("/:id", isLoggedIn, (req,res) => {
    Post.findByIdAndRemove(req.params.id, (error) => {
        if(error){
            res.redirect("/");
        } else {
            res.redirect("/blog");
        };
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