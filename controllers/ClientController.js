const Client = require("../models/Client");
// import the respository class
const ClientRepo = require("../repos/ClientRepo");

// Import packageReader and get contributors
const packageReader = require("../packageReader");
const contributors = packageReader.getContributors();

// initialise an instance of the class
const _clientRepo = new ClientRepo();

// Get method for Clients Home
exports.ClientsIndex = async (req, res) => {
  // create a variable for clients
  let clients;
  // check for any query parameters
  const { searchedName } = req.query;
  // if there is a query parameter
  if (searchedName) {
    console.log("fetching data for search term from controller");
    // get results for this search param from repo
    clients = await _clientRepo.getClientsbyName(searchedName);
  } else {
    console.log("fetching all clients data from controller");
    // get all clients from repo
    clients = await _clientRepo.getAllClients();
  }
  // render the Clients Index page
  res.status(200).render("clientsIndex", {
    title: "Express Billing Clients Home",
    contributors: contributors,
    clients: clients ? clients : [],
    message: clients.length>0 ? "" : "No clients found!",
  });
};

// Get Method for Client Create Form
exports.CreateClientForm = (req, res) => {
  res.render("clientCreate", {
    title: "Express Billing Create Client",
    contributors: contributors,
    customer: {},
    message: "",
  });
};

// Post Method for Client Create Form
exports.AddClient = async (req, res) => {
  // get client data from form and create an object
  const newClient = {
    name: req.body.clientName,
    code: req.body.clientCode,
    company: req.body.clientCompany,
    email: req.body.clientEmail,
  };
  // send this data to repository to add a new client
  const response = await _clientRepo.createClient(newClient);
  // if response does not contain error
  if (!response.includes("error")) {
    const newClientId = response;
    // Redirect to client
    res.redirect(`/clients/${newClientId}`);
    // // get current list of clients
    // const clients = await _clientRepo.getAllClients();
    // // render the Clients Index page
    // res.status(200).render("clientsIndex", {
    //   title: "Express Billing Clients Home",
    //   contributors: contributors,
    //   clients: clients ? clients : [],
    // });
  }
  // otherwise stay on form and repopulate fields, send error as a message
  else {
    res.render("clientCreate", {
      title: "Express Billing Create Client",
      contributors: contributors,
      customer: newClient,
      message: response,
    });
  }
};

// Get method to get a particular client's details
exports.ClientDetails = async function (req, res) {
  // retrieve client id from url params
  const clientId = req.params.clientId;
  // Get client from repo
  console.log("getting client from repo");
  const client = await _clientRepo.getClientById(clientId);
  // if client is not null
  if (client) {
    console.log(`client${clientId}'s record retreived successfully!`);
    // render client details page and send this client doc object
    res.render("clientDetails", {
      title: `Express Billing Client ${clientId}`,
      contributors: contributors,
      customer: client,
      message: "",
    });
  }
  // if not then send a null client prop
  else {
    console.log(`client ${clientId}'s record not found!`);
    // render client details page and send this client doc object
    res.render("404", {
      title: `Express Billing Page Not Found`,
      contributors: contributors,
    });
  }
};

// Get method to display update form
exports.UpdateClientForm = async function (req, res) {
  // retrieve client id from url params
  const clientId = req.params.clientId;
  // retrieve client's records
  console.log("retrieving client's records!");
  const client = await _clientRepo.getClientById(clientId);
  if (client) {
    console.log(`client${clientId}'s record retreived successfully!`);
    // render form for editing client's details
    res.render("clientCreate", {
      title: `Express Billing Update Client ${clientId}`,
      contributors: contributors,
      customer: client,
      message: "",
    });
  } else {
    // render 404 page
    console.log("no client found");
    res.render("404", {
      title: "Express Billing Page not found",
      contributors: contributors,
    });
  }
};

// Post method to update client details
exports.UpdateClient = async function (req, res) {
  // retrieve client id from url params
  const clientId = req.params.clientId.toString();
  console.log(clientId);
  console.log(await _clientRepo.getClientById(clientId));
  // get updated data from form and create an object
  const updatedClient = {
    id: clientId,
    name: req.body.clientName,
    code: req.body.clientCode,
    company: req.body.clientCompany,
    email: req.body.clientEmail,
  };
  // send the object to repo update client method
  console.log("sending the data to repo for client data update");
  const response = await _clientRepo.updateClient(updatedClient);
  // if we get true, that means update was successfull
  if (response) {
    // redirect to client's details page
    res.redirect(`/clients/${clientId}`);
  } else {
    // render the form again
    res.render("clientCreate", {
      title: `Express Billing Update Client ${clientId}`,
      contributors: contributors,
      customer: updatedClient,
      message: "Error saving details!",
    });
  }
};

exports.DeleteClient = async function (req, res) {
  // retrieve client id from url params
  const clientId = req.params.clientId;
  // send for deletion
  const response = await _clientRepo.deleteClient(clientId);
  // get clients from repo
  const clients = await _clientRepo.getAllClients();
  // if deletion was successful, we get a response object
  if (response) {
    console.log(`client ${clientId} deleted successfully!`);
    // render the Clients Index page
    res.status(200).render("clientsIndex", {
      title: "Express Billing Clients Home",
      contributors: contributors,
      clients: clients ? clients : [],
      message: response,
    });
  } else {
    // render the Clients Index page with an error message
    res.status(200).render("clientsIndex", {
      title: "Express Billing Clients Home",
      contributors: contributors,
      clients: clients ? clients : [],
      message: "Error deleting client record!",
    });
  }
};
