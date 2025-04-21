const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig"); // Import multer config
const blogModel = require("../models/blog-nodel");
const { isLoggedIn } = require("../middlewares/auth-middlewares");

router.get("/create", isLoggedIn, function(req, res){
  let success = req.flash("success");
  res.render("createBlog", { success });
});

router.post("/create", upload.single("image"), async function(req, res){
  try{
    let{title, description} = req.body;

    let blog = await blogModel.create({
      image: req.file.buffer,
      title,
      description,
    });

    req.flash("success", "blog created successfully.")
    res.redirect("/blog")
  } catch(err){
    res.send(err.message)
  }
});



module.exports = router;




