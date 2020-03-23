const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const indexRoutes = require("./routes/index");
const usersRoute = require("./routes/users");
const mongoURI = require("./config/keys").MongoURI;

const app = express();

// passport config
require("./config/passport")(passport);

// db connection
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected..."))
    .catch(err => console.log(`error: ${err}`));

// ejs
app.use(expressLayouts);
app.set("view engine", "ejs");

// body parser
app.use(express.urlencoded({ extended: false }));

// express session
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash message
app.use(flash());

// global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// routes
app.use("/", indexRoutes);
app.use("/users", usersRoute);

// listen to server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`listining to port ${PORT}`));
