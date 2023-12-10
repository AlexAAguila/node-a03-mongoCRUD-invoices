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

exports.Create = async function (req, res) {
  try {
    const clients = await _invoiceRepo.getAllClients();
    const products = await _invoiceRepo.getAllProducts();
    res.render("invoiceCreate", {
      title: "Express Billing - Create Invoice",
      clients: clients,
      products: products,
      invoice: {},
      contributors: contributors,
    });
  } catch (error) {
    res.render("error", {
      message: "Error fetching clients or products",
      error,
    });
  }
};

exports.createInvoice = async function (req, res) {
  try {
    const { client, invoiceNumber, issueDate, dueDate, products } = req.body;

    const newInvoiceData = {
      client: client,
      invoiceNumber: invoiceNumber,
      issueDate: issueDate,
      dueDate: dueDate,
      products: products,
    };

    const createdInvoice = await _invoiceRepo.createInvoice(newInvoiceData);

    res.redirect("/invoices/"); // Redirect to the invoice index page
  } catch (error) {
    res.render("error", { message: "Error creating invoice", error });
  }
};
