const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: Buffer, // Store as binary
});

module.exports = mongoose.model("Blog", blogSchema);
