const INSTAGRAM_TOKEN = process.env.INSTAGRAM_TOKEN; 

const CLOUDINARY_SETTINGS = {
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
};

module.exports = {
    CLOUDINARY: CLOUDINARY_SETTINGS,
    INSTAGRAM_TOKEN: INSTAGRAM_TOKEN
}