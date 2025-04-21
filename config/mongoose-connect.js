const mongoose = require("mongoose");


mongoose.connect(process.env.MONGODB_URI).then(function(){
    console.log("connected to mongodb");
});

let db = mongoose.connection;

module.exports = db;