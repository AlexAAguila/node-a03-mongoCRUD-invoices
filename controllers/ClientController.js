const Client = require("../models/Client");
// import the respository class
const ClientRepo = require("../repos/ClientRepo");
const passport = require("passport");


const RequestService = require("../services/RequestService");


// Import packageReader and get contributors
const packageReader = require("../packageReader");
const contributors = packageReader.getContributors();

// initialise an instance of the class
const _clientRepo = new ClientRepo();

// Get method for Clients Home
exports.ClientsIndex = async (req, res) => {
  let reqInfo = RequestService.reqHelper(req, ["Admin", "Manager"]);
  if (reqInfo.rolePermitted) {
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
    reqInfo: reqInfo,
    message: clients.length>0 ? "" : "No clients found!",
  });
}
else {
  res.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};

// Get Method for Client Create Form
exports.CreateClientForm = (req, res) => {
  let reqInfo = RequestService.reqHelper(req, ["Admin"]);
  if (reqInfo.rolePermitted) {
    res.render("clientCreate", {
    title: "Express Billing Create Client",
    contributors: contributors,
    customer: {},
    reqInfo: reqInfo,
    message: "",
  });
}
else {
  res.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};

// Post Method for Client Create Form
exports.AddClient = async (req, res) => {
  let reqInfo = RequestService.reqHelper(req, ["Admin"]);
  if (reqInfo.rolePermitted) {
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
      reqInfo: reqInfo,
      message: response,
    });
  }
}
else {
  res.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};

// Get method to get a particular client's details
exports.ClientDetails = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req, ["Admin", "Manager"]);
  if (reqInfo.rolePermitted) {
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
      reqInfo: reqInfo,
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
      reqInfo: reqInfo,
    });
  }
}
else {
  res.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};

// Get method to display update form
exports.UpdateClientForm = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req, ["Admin", "Manager"]);
  if (reqInfo.rolePermitted) {
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
      reqInfo: reqInfo,
      message: "",
    });
  } else {
    // render 404 page
    console.log("no client found");
    res.render("404", {
      title: "Express Billing Page not found",
      contributors: contributors,
      reqInfo: reqInfo,
    });
  }
}
else {
  res.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};

// Post method to update client details
exports.UpdateClient = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req, ["Admin", "Manager"]);
  if (reqInfo.authenticated) {
  // retrieve client id from url params
  const clientId = req.params.clientId.toString();
  console.log(clientId);
  console.log(await _clientRepo.getClientById(clientId));
  // get updated data from form and create an object
  const updatedClient = {
    id: clientId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    code: req.body.clientCode,
    company: req.body.clientCompany,
    username: req.body.clientEmail,
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
      reqInfo: reqInfo,
      message: "Error saving details!",
    });
  }
}
else {
  res.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};

exports.DeleteClient = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req, ["Admin", "Manager"]);
  if (reqInfo.authenticated) {
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
      reqInfo: reqInfo,
      message: response,
    });
  } else {
    // render the Clients Index page with an error message
    res.status(200).render("clientsIndex", {
      title: "Express Billing Clients Home",
      contributors: contributors,
      clients: clients ? clients : [],
      reqInfo: reqInfo,
      message: "Error deleting client record!",
    });
  }
}
else {
  res.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};

// Displays registration form.
exports.Register = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
console.log("Hello")
return res.render("user/register", { 
  title: "Express-Billing - Register",
  reqInfo: reqInfo,
  errorMessage: "", 
user: {}, 
contributors: contributors, 
});
};
// Handles 'POST' with registration form submission.
exports.RegisterUser = async function (req, res) {
const password = req.body.password;
const passwordConfirm = req.body.passwordConfirm;
if (password == passwordConfirm) {
  // Creates user object with mongoose model.
  // Note that the password is not present.
  const newUser = new Client({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    code: req.body.code,
    company: req.body.company
  });
  // Uses passport to register the user.
  // Pass in user object without password
  // and password as next parameter.
  Client.register(
    new Client(newUser),
    req.body.password,
    function (err, account) {
      // Show registration form with errors if fail.
      if (err) {
        let reqInfo = RequestService.reqHelper(req);
        return res.render("user/register", {
          user: newUser,
          errorMessage: err,
          reqInfo: reqInfo,
          title: "Error",
          contributors: contributors,

        });
      }
      // User registration was successful, so let's immediately authenticate and redirect to home page.
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    }
  );
} else {
  let reqInfo = RequestService.reqHelper(req);
  res.render("user/register", {
    user: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
    },
    errorMessage: "Passwords do not match.",
    reqInfo: reqInfo,
    title: "Error",
      reqInfo: reqInfo,
      contributors: contributors,

  });
}
};

// Show login form.
exports.Login = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  let errorMessage = req.query.errorMessage;
  res.render("user/login", {
      title: "Express-Billing - Login",
  reqInfo: reqInfo,
  errorMessage: errorMessage, 
  user: {}, 
  contributors: contributors, 
  });
};
// Receive login information, authenticate, and redirect depending on pass or fail.
exports.LoginUser = async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/login?errorMessage=Invalid login.",
  })(req, res, next);
};

// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
  // Use Passports logout function
  req.logout((err) => {
    if (err) {
      console.log("logout error");
      return next(err);
    } else {
      // logged out. Update the reqInfo and redirect to the login page
      let reqInfo = RequestService.reqHelper(req);
      res.render("user/login", {
      title: "Express-Billing - Login",
        user: {},
        isLoggedIn: false,
        errorMessage: "",
        reqInfo: reqInfo,
        contributors: contributors, 
      });
    }
  });
};


exports.Profile = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated) {


    let roles = await _clientRepo.getRolesByUsername(reqInfo.username);
    let sessionData = req.session;
    sessionData.roles = roles;
    reqInfo.roles = roles;
    let userInfo = await _clientRepo.getUserByUsername(reqInfo.username);
    console.log(userInfo)
    return res.render("user/profile", {
      title: `Express Billing Client ${reqInfo.username}`,
      reqInfo: reqInfo,
      message: "",
      contributors: contributors,      
      userInfo: userInfo,
    });
  } else {
    res.redirect(
      "/user/login?errorMessage=You must be logged in to view this page."
    );
  }
};

// Get method to display update form
exports.UpdateProfileForm = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated) {
    const loggedInUserId = reqInfo._id; // userId
    // Retrieve client id from URL params
    const clientId = req.params.clientId;
    // If the logged-in user ID doesn't match the ID in the URL, prevent access
    if (loggedInUserId != clientId) {
      return res.redirect(
        "/user/login?errorMessage=Access Denied"
      );
    }
  // retrieve client id from url params
  const clientIdURL = req.params.clientId;
  // retrieve client's records
  console.log("retrieving client's records!");
  const client = await _clientRepo.getClientById(clientIdURL);
  if (client) {
    console.log(`client${clientIdURL}'s record retreived successfully!`);
    // render form for editing client's details
    res.render("user/profile-edit", {
      title: `Express Billing Update Client ${clientIdURL}`,
      contributors: contributors,
      customer: client,
      reqInfo: reqInfo,
      message: "",
    });
  } else {
    // render 404 page
    console.log("no client found");
    res.render("404", {
      title: "Express Billing Page not found",
      contributors: contributors,
      reqInfo: reqInfo,
    });
  }
}
else {
  res.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};

// Post method to update client details
exports.UpdateProfile = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req);
  if (reqInfo.authenticated) {
    const loggedInUserId = reqInfo._id; // userId
      // Retrieve client id from URL params
      const clientId = req.params.clientId;
      // If the logged-in user ID doesn't match the ID in the URL, prevent access
      if (loggedInUserId != clientId) {
        return res.redirect(
          "/user/login?errorMessage=Access Denied"
        );
      }

  // retrieve client id from url params
  const clientIdURL = req.params.clientId.toString();
  console.log(clientIdURL);
  console.log(await _clientRepo.getClientById(clientIdURL));
  // get updated data from form and create an object
  const updatedClient = {
    id: clientIdURL,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    code: req.body.clientCode,
    company: req.body.clientCompany,
    username: req.body.clientEmail,
  };
  // send the object to repo update client method
  console.log("sending the data to repo for client data update");
  const response = await _clientRepo.updateClient(updatedClient);
  // if we get true, that means update was successfull
  if (response) {
    // redirect to client's details page
    res.redirect(`/user/profile`);
  } else {
    // render the form again
    res.render("/:clientId/profile-edit", {
      title: `Express Billing Update Client ${clientIdURL}`,
      contributors: contributors,
      customer: updatedClient,
      reqInfo: reqInfo,
      message: "Error saving details!",
    });
  }
}
else {
  res.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};