// import express
const express = require("express");
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
const logger = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");

// create a port
const PORT = process.env.PORT || 3003;

// create a server
const app = express();

// get uri string
const uri = process.env.MONGO_CONNECTION_STRING;

// database setup
mongoose.connect(uri);
// store a reference to the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// log all requestsusing the morgan's dev template
app.use(logger("dev"));

// allow cross origin requests
app.use(cors({ origin: [/127.0.0.1.*/, /localhost.*/] }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// use express.static middleware to make the public folder accessible
app.use(express.static("public"));

// Set EJS up
app.use(expressLayouts);
app.set("layout", "./layouts/full-width");

// Set default views folder
app.set("views", path.join(__dirname, "views"));
// Set view engine as ejs
app.set("view engine", "ejs");

// get routers
const indexRouter = require("./routers/indexRouter");
const clientsRouter = require("./routers/clientsRouter");
const productsRouter = require("./routers/productsRouter");
const invoicesRouter = require("./routers/invoicesRouter");

// Use the routers
app.use("/", indexRouter);
app.use("/products", productsRouter);
app.use("/clients", clientsRouter);
app.use("/invoices", invoicesRouter);

// for any other pages get 404
const packageReader = require('./packageReader');
const contributors = packageReader.getContributors();
app.get("/*",(req,res)=>{
    // Respond with a 404 error status and render the 404.ejs page
  res.status(404).render("404",{title:"Express Billing - Page Not Found",contributors});
});

// start listening
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
