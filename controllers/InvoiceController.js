const Invoice = require("../models/Invoice");

const InvoiceRepo = require("../repos/InvoiceRepo");

const _invoiceRepo = new InvoiceRepo();

// Import packageReader and get contributors
const packageReader = require("../packageReader");
const contributors = packageReader.getContributors();

exports.Index = async function (request, response) {
  let invoices = await _invoiceRepo.getAllInvoices();
  // check for any query parameters
  const { searchedName } = request.query;
  // if there is a query parameter
  if (searchedName) {
    console.log("fetching data for search term from controller");
    // get results for this search param from repo
    invoices = await _invoiceRepo.getInvoicebyName(searchedName);
  } else {
    console.log("fetching all clients data from controller");
    // get all products from repo
    invoices = await _invoiceRepo.getAllInvoices();
  }
  if (invoices) {
    response.render("invoiceIndex", {
      title: "Express Billing - Invoice",
      invoices: invoices,
      contributors: contributors,
    });
  } else {
    response.render("invoiceIndex", {
      title: "Express Billing - Invoice",
      invoices: [],
      contributors: contributors,
    });
  }
};

// Handle product form GET request
exports.Create = async function (request, response) {
  try {
    // Fetch clients and products from the repository
    const clients = await _invoiceRepo.getAllClients();
    const products = await _invoiceRepo.getAllProducts();
    const invoice = {};

    response.render("invoiceCreate", {
      title: "Create an Invoice",
      errorMessage: "",
      clients: clients,
      products: products,
      invoice: invoice,
      contributors: contributors,
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
