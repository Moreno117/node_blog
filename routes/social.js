var express = require("express");
var axios = require("axios");
var APIS = require("./../util");

const router = express.Router();

router.get("/", (req,res) => {
    const instagramUrl = "https://api.instagram.com/"
    const numberItems = 6;
    axios.get(`${instagramUrl}v1/users/self/media/recent/?access_token=${APIS.INSTAGRAM_TOKEN}&count=${numberItems}`)
        .then(response => {
            const { data } = response.data;
            res.render("social/social.ejs", { instagramData : data });
        })
        .catch(error => {
            console.log("There was an error ------->", error);
            res.redirect("/");
        })
});

module.exports = router;