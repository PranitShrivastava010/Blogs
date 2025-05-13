process.env.NODE_ENV = 'development';
const express = require("express");
const app = express();
const path = require("path");
const indexRouter = require("./Routes/index");
const blogRouter = require("./Routes/blog");
const expressSession = require("express-session")
const flash = require("connect-flash");



const cookieParser = require("cookie-parser");

require("dotenv").config();
const db = require("./config/mongoose-connect");

app.set("view engine", 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);
app.use(flash());

app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
  });

app.use("/", indexRouter);
app.use("/blog", blogRouter);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
