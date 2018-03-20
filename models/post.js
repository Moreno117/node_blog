var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");

var postSchema = new mongoose.Schema({
  title: String,
  image: String,
  content: String,
  resume: String
});

postSchema.plugin(mongoosePaginate);

var Post = mongoose.model("Post", postSchema);

module.exports = Post;
