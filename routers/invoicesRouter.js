const express = require("express");

const invoicesRouter = express.Router();

// Handle requests to the /invoices route
const packageReader = require('../packageReader');
const contributors = packageReader.getContributors();
invoicesRouter.get("/", (req, res) => {
  // Respond with a 404 error status and render the 404.ejs page
  res.status(404).render("404",{title:"Express Billing - Home Page",contributors});
});

module.exports = invoicesRouter;
