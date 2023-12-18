"use strict"

const express = require("express");

// create a router
const clientsRouter = express.Router();

// Import Action methods from controller
const{ClientsIndex,CreateClientForm,AddClient,ClientDetails,UpdateClientForm,UpdateClient,DeleteClient} = require("../controllers/ClientController.js");
const ClientController = require("../controllers/ClientController.js");

// Define routes

// Get route for Clients Index
clientsRouter.get("/",ClientsIndex);
// Get route for displaying client create form
clientsRouter.get("/create",CreateClientForm);
// Post route for using data from form to create a new document / record
clientsRouter.post("/create",AddClient);
// Get route for getting a particular client's details
clientsRouter.get("/:clientId",ClientDetails);
// Get route for updating a client's details
clientsRouter.get("/:clientId/edit",UpdateClientForm);
// Post route for updating a client's details
clientsRouter.post("/:clientId/edit",UpdateClient);
// Get route for deleting a client's details
clientsRouter.get("/:clientId/delete",DeleteClient);

// GET register page
clientsRouter.get("/user/register", ClientController.Register);

// Handle register form submission
clientsRouter.post("/user/register", ClientController.RegisterUser);

// GET login page
clientsRouter.get("/user/login", ClientController.Login);
// Handle login form submission
clientsRouter.post("/user/login", ClientController.LoginUser);

// GET logout
clientsRouter.get("/user/logout", ClientController.Logout);

// GET profile page
clientsRouter.get("/user/profile", ClientController.Profile);


clientsRouter.get("/:clientId/profile-edit",ClientController.UpdateProfileForm);
// Post route for updating a client's details
clientsRouter.post("/:clientId/profile-edit",ClientController.UpdateProfile);
// Get route for deleting a client's details
// Export the router
module.exports = clientsRouter;
