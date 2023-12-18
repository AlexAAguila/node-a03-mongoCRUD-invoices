// import express
const express = require("express");
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
const logger = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Database Setup
const mongoose = require("mongoose");
const uri = process.env.MONGO_CONNECTION_STRING;

console.log(uri);

// Connect to the database
mongoose.connect(uri, { useNewUrlParser: true });
// Store a reference to the default connection
const db = mongoose.connection;
// Log once we have a connection to Atlas
db.once("open", function () {
  console.log("Connected to Mongo");
});
// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Set up our server
const app = express();
// Parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Set up session management
app.use(
  require("express-session")({
    secret: "a long time ago in a galaxy far far away",
    resave: false,
    saveUninitialized: false,
  })
);
// Set up EJS templating
app.set("view engine", "ejs");
// Enable layouts
app.use(expressLayouts);
// Set the default layout
app.set("layout", "./layouts/full-width");
// Make views folder globally accessible
app.set("views", path.join(__dirname, "views"));
// Make the public folder accessible for serving static files
app.use(express.static("public"));


app.use(passport.initialize());
app.use(passport.session());
const Client = require("./models/Client");
passport.use(new LocalStrategy(Client.authenticate()));
passport.serializeUser(Client.serializeUser());
passport.deserializeUser(Client.deserializeUser());

// get routers
const indexRouter = require("./routers/indexRouter");
const clientsRouter = require("./routers/clientsRouter");
const productsRouter = require("./routers/productsRouter");
const invoicesRouter = require("./routers/invoicesRouter");
// const userRouter = require("./routers/userRouter");
// const secureRouter = require("./routers/secureRouter");

// Use the routers
app.use("/", indexRouter);
app.use("/products", productsRouter);
app.use("/invoices", invoicesRouter);
app.use("/clients", clientsRouter);
app.use( clientsRouter);
// app.use(userRouter);
// app.use("/secure", secureRouter);


// for any other pages get 404
const packageReader = require('./packageReader');
const contributors = packageReader.getContributors();
app.get("/*",(req,res)=>{
    // Respond with a 404 error status and render the 404.ejs page
  res.status(404).render("404",{title:"Express Billing - Page Not Found",contributors});
});


// start listening
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
