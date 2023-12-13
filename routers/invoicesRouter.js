const express = require("express");
const InvoiceController = require("../controllers/InvoiceController");

const invoicesRouter = express.Router();

// Handle requests to the /invoices route
const packageReader = require("../packageReader");
const contributors = packageReader.getContributors();
// invoicesRouter.get("/", (req, res) => {
//   // Respond with a 404 error status and render the 404.ejs page
//   res.status(404).render("404",{title:"Express Billing - Home Page",contributors});
// });

// Get route for invoice index
invoicesRouter.get("/", InvoiceController.Index);
// Get route for invoice create form
invoicesRouter.get("/create", InvoiceController.Create);
invoicesRouter.post("/create", InvoiceController.createInvoice);

// show individual product details
invoicesRouter.get("/:id", InvoiceController.Detail);

//productsRouter.get("/:id/delete", ProductController.DeleteProductById);

const Invoices = require("../models/Invoice.js"); // Your Mongoose model

invoicesRouter.get("/dropdown", async (req, res) => {
  try {
    // Fetch data from MongoDB
    const products = await Invoices.find({}, "Products"); // Replace 'fieldName' with the field you want in the dropdown

    res.render("invoiceCreate", { data: products }); // Pass data to the view
  } catch (err) {
    // Handle error
    res.status(500).send("Error fetching data");
  }
});

module.exports = invoicesRouter;
