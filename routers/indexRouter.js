const express = require("express");

// create a router
const indexRouter = express.Router();
const IndexController = require("../controllers/IndexController");

// Import packageReader and get contributors
const packageReader = require('../packageReader');
const contributors = packageReader.getContributors();

// define base route
indexRouter.get("/",IndexController.Index);

// Rest of the code to follow...

// Export the router
module.exports = indexRouter;