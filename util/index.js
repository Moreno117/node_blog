const INSTAGRAM_TOKEN = process.env.INSTAGRAM_TOKEN; 

const CLOUDINARY_SETTINGS = {
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
};

const TWITTER_PASS = {
    "consumerKey": process.env.TWITTER_CONSUMER_KEY,
    "consumerSecret": process.env.TWITTER_CONSUMER_SECRET,
    "accessToken": process.env.TWITTER_ACCESS_TOKEN,
    "accessTokenSecret": process.env.TWITTER_TOKEN_SECRET,
    "callBackUrl": process.env.TWITTER_CALLBACK_URL
};

module.exports = {
    CLOUDINARY: CLOUDINARY_SETTINGS,
    INSTAGRAM_TOKEN: INSTAGRAM_TOKEN,
    TWITTER_SETTINGS: TWITTER_PASS
};