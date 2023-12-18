const Invoice = require("../models/Invoice");

const InvoiceRepo = require("../repos/InvoiceRepo");
const RequestService = require("../services/RequestService");

const _invoiceRepo = new InvoiceRepo();


// Import packageReader and get contributors
const packageReader = require("../packageReader");
const contributors = packageReader.getContributors();

exports.Index = async function (request, response) {
  let reqInfo = RequestService.reqHelper(request, ["Admin", "Manager"]);
  if (reqInfo.authenticated) {
    let invoices;
    let clients;
    const loggedInUserId = reqInfo._id; // Assuming the user ID is stored in reqInfo
    if(reqInfo.rolePermitted){
   invoices = await _invoiceRepo.getAllInvoices();
  // check for any query parameters
  const { searchedName } = request.query;
  clients = await _invoiceRepo.getAllClients();
  // if there is a query parameter
  if (searchedName) {
    console.log("fetching data for search term from controller");
    // get results for this search param from repo
   invoices = await _invoiceRepo.getInvoicebyId(searchedName);
  } else {
    console.log("fetching all clients data from controller");
    // get all products from repo
     invoices = await _invoiceRepo.getAllInvoices();
  }
}
else{
  try {
  invoices =  await _invoiceRepo.getUserInvoices(loggedInUserId);
  console.log(invoices); // This log will display the fetched invoices
  // Further operations with invoices should be placed here
} catch (error) {
  console.error(error);
}

}


  if (invoices) {
    response.render("invoiceIndex", {
      title: "Express Billing - Invoice",
      invoices: invoices,
      clients: clients,
      reqInfo: reqInfo,
      contributors: contributors,
    });
  } else {
    response.render("invoiceIndex", {
      title: "Express Billing - Invoice",
      invoices: [],
      reqInfo: reqInfo,
      contributors: contributors,
    });
  }
}
else {
  response.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};

exports.Create = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req, ["Admin", "Manager"]);
  if (reqInfo.rolePermitted) {
    try {
    const clients = await _invoiceRepo.getAllClients();
    const products = await _invoiceRepo.getAllProducts();
    res.render("invoiceCreate", {
      title: "Express Billing - Create Invoice",
      clients: clients,
      products: products,
      reqInfo: reqInfo,
      invoice: {},
      contributors: contributors,
    });
  } catch (error) {
    res.render("404", {
      title: "Error Fetching Invoice",
      message: "Error fetching clients or products",
      error,
      reqInfo: reqInfo,
      contributors: contributors,
    });
  }
}
else {
  res.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};

exports.createInvoice = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req, ["Admin", "Manager"]);
  if (reqInfo.rolePermitted) {
    try {
    const { client, invoiceNumber, issueDate, dueDate, products } = req.body;

    let quantities = [];
const { lineItems } = req.body; // Extract the lineItems array from the request body

if (lineItems && Array.isArray(lineItems)) {
  for (let i = 0; i < lineItems.length; i++) {
    const quantity = lineItems[i]; // Access each quantity directly from lineItems
    console.log(quantity);
    quantities.push(quantity);
  }
}

    const newInvoiceData = {
      client: client,
      invoiceNumber: invoiceNumber,
      issueDate: issueDate,
      dueDate: dueDate,
      products: products,
      quantities: quantities,
    };

    const createdInvoice = await _invoiceRepo.createInvoice(newInvoiceData);

    res.redirect("/invoices/"); // Redirect to the invoice index page
  } catch (error) {
   
    res.render("404", {
      title: "Error Creating Invoice",
      message: "Error fetching clients or products",
      error,
      reqInfo: reqInfo,
      contributors: contributors,
    });
  }
}
else {
  res.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};

exports.Detail = async function (request, response) {
  let reqInfo = RequestService.reqHelper(request, ["Admin", "Manager"]);
  if (reqInfo.authenticated) {
  const invoiceId = request.params.id;
  let invoice = await _invoiceRepo.fetchInvoiceById(invoiceId);

  // let invoices = await _invoiceRepo.getAllProducts();
  if (invoice) {
    // render product details page and send this product doc object
    response.render("invoiceDetails", {
      title: "Express Billing - " + invoice.invoiceNumber,
      invoice: invoice,
      reqInfo: reqInfo,
      layout: "./layouts/invoice",
      contributors: contributors,
    });
  } else {
    // render 404 page

    console.log(`product ${request.params.id}'s record not found!`);
    response.render("404", {
      title: "Error Creating Invoice",
      message: "Error fetching clients or products",
      reqInfo: reqInfo,
      error,
      contributors: contributors,
    });
  }
}
else {
  response.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};

// Handle product form delete request
exports.DeleteInvoiceById = async function (req, res) {
  let reqInfo = RequestService.reqHelper(req, ["Admin"]);
  if (reqInfo.rolePermitted) {
    const invoiceId = req.params.id;
  let deletedProduct = await _invoiceRepo.deleteProductById(invoiceId);
  let invoices = await _invoiceRepo.getAllInvoices();

  if (deletedProduct) {
    // if delete is successful go to invoice page
    res.redirect("/invoices/"); // Redirect to the invoice index page
  } else {
    // else render productIndex page
    res.render("invoiceIndex", {
      title: "Express Billing - Invoice",
      invoices: invoices,
      reqInfo: reqInfo,
      contributors: contributors,
    });
  }
}
else {
  res.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};


exports.Paid = async function (request, response) {
  let reqInfo = RequestService.reqHelper(request, ["Admin", "Manager"]);
  if (reqInfo.authenticated) {
    const invoiceId = request.params.id;
    console.log(invoiceId)
    const invoice = await _invoiceRepo.updateInvoicePaid(invoiceId);
  const clients = await _invoiceRepo.getAllClients();
  const invoices = await _invoiceRepo.getAllInvoices();

  // let invoices = await _invoiceRepo.getAllProducts();
  if (invoice) {
    // render product details page and send this product doc object
    response.render("invoiceIndex", {
      title: "Express Billing - Invoice",
      invoices: invoices,
      clients: clients,
      reqInfo: reqInfo,
      contributors: contributors,
    });
  } else {
    // render 404 page

    console.log(`product ${request.params.id}'s record not found!`);
    response.render("404", {
      title: "Error updating page",
      message: "Error fetching clients or products",
      reqInfo: reqInfo,
      contributors: contributors,
    });
  }
}
else {
  response.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};