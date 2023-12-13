const Invoice = require("../models/Invoice");

const InvoiceRepo = require("../repos/InvoiceRepo");

const _invoiceRepo = new InvoiceRepo();

const _productRepo = require("../repos/ProductRepo");

// Import packageReader and get contributors
const packageReader = require("../packageReader");
const contributors = packageReader.getContributors();

exports.Index = async function (request, response) {
  let invoices = await _invoiceRepo.getAllInvoices();
  // check for any query parameters
  const { searchedName } = request.query;
  let clients = await _invoiceRepo.getAllClients();
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
      clients: clients,
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
    res.render("404", {
      title: "Error Fetching Invoice",
      message: "Error fetching clients or products",
      error,
      contributors: contributors,
    });
  }
};

exports.createInvoice = async function (req, res) {
  try {
    const { client, invoiceNumber, issueDate, dueDate, products } = req.body;

    let quantities = [];
    for (i = 0; i < products.length; i++) {
      console.log(req.body);
      const quantityKey = `lineItems[${i}].quantity`;
      const quantity = req.body[quantityKey];

      if (quantity) {
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
      contributors: contributors,
    });
  }
};

exports.Detail = async function (request, response) {
  const invoiceId = request.params.id;
  let invoice = await _invoiceRepo.fetchInvoiceById(invoiceId);
  // let invoices = await _invoiceRepo.getAllProducts();
  if (invoice) {
    // render product details page and send this product doc object
    response.render("invoiceDetails", {
      title: "Express Billing - " + invoice.invoiceNumber,
      invoice: invoice,
      layout: "./layouts/invoice",
      contributors: contributors,
    });
  } else {
    // render 404 page
    console.log(`product ${request.params.id}'s record not found!`);
    response.render("404", {
      title: "Error Creating Invoice",
      message: "Error fetching clients or products",
      error,
      contributors: contributors,
    });
  }
};

// Handle product form delete request
exports.DeleteInvoiceById = async function (req, res) {
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
      contributors: contributors,
    });
  }
};
