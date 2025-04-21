const jwt = require("jsonwebtoken");
const express = require("express");
const userModel = require("../models/user-model");
const blogModel = require("../models/blog-nodel");
const { genSalt } = require("bcrypt");
const router = express.Router();
const bcrypt = require("bcrypt");
const { isLoggedIn } = require("../middlewares/auth-middlewares");
const upload = require("../config/multerConfig");

router.get("/", function(req, res){
    res.render("login")
});

router.get("/register", function(req,res){
    res.render("register");
})

router.post("/register", async function(req, res){
    let{username, email, password} = req.body;
    try{
        let user = await userModel.findOne({email})
        if(user) return res.send("you already have an account")
        
        let salt = await bcrypt.genSalt(10)   
        let hashed = await bcrypt.hash(password, salt); 

        createduser = await userModel.create({
            username,
            email,
            password: hashed,
        });
        let token = jwt.sign(
            { id: createduser._id, email: createduser.email },
            process.env.JWT_KEY
        );
        res.cookie("token", token)
        res.redirect("/")
    }catch(err){
        res.send(err.message);
    }
});


router.post("/login", async function(req, res){
    let{email, password} = req.body
    let user = await userModel.findOne({ email }).select("+password");
    if(!user)return res.send("you don't have an account, please register")
    
    let result = await bcrypt.compare(password, user.password);
    if(result){
        let token = jwt.sign(
            {id: user._id, email: user.email},
            process.env.JWT_KEY
        );
        res.cookie("token", token);
        res.redirect("/blog");
    }else{
        return res.send("your details are incorrect");
    }
});

router.get("/blog", isLoggedIn , async function(req, res){
    let blogs = await blogModel.find()
    res.render("blog",{blogs})
});

router.get("/logout", function(req, res){
    res.cookie("token", "")
    res.redirect("/")
});

router.get("/edit/:blogid", isLoggedIn, async function(req, res){
  let blog = await blogModel.findOne({_id: req.params.blogid});
  let imageBase64 = blog.image ? blog.image.toString("base64") : null;
  res.render("edit", {blog, imageBase64}); 
});

router.post("/edit/:blogid", upload.single("image"), async function(req, res){
    let {title, description} = req.body;

    const updateData = {
        title,
        description,
    };

    if(req.file){
        updateData.image = req.file.buffer;
    }

    await blogModel.findByIdAndUpdate(req.params.blogid, updateData)
    res.redirect("/blog")

});

router.get("/delete/:blogid", isLoggedIn, async function(req, res){
    let blog = await blogModel.findOneAndDelete({_id: req.params.blogid});
    res.redirect("/blog");
})

module.exports = router;