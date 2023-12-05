const ProductController = require("../controllers/ProductController");

const fs = require("fs").promises;
const path = require("path");

const express = require("express");
// create a router
const productsRouter = express.Router();

// construct the path to our repos folder
const dataPath = path.join(__dirname, "../repos/");

// show all products
productsRouter.get("/", ProductController.Index);

// create before detail route
productsRouter.get("/create", ProductController.Create);
productsRouter.post("/create", ProductController.CreateProduct);

// show individual product details
productsRouter.get("/:id", ProductController.Detail);

productsRouter.get("/:id/delete", ProductController.DeleteProductById);

// Show Create Profile Form
productsRouter.get("/:id/edit/", ProductController.Edit);
// Handle Create Profile Form Submission
productsRouter.post("/:productId/edit/", ProductController.EditProduct);

// Export the router
module.exports = productsRouter;
