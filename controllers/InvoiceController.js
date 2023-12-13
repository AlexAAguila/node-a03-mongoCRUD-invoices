const Invoice = require("../models/Invoice");

const InvoiceRepo = require("../repos/InvoiceRepo");

const _invoiceRepo = new InvoiceRepo();

const _productRepo = require("../repos/ProductRepo")

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
    res.render("404", {
      title: "Error Fetching Invoice",
      message: "Error fetching clients or products",
      error,
      contributors: contributors
    });
  }
};

exports.createInvoice = async function (req, res) {
  try {
    const { client, invoiceNumber, issueDate, dueDate, products } = req.body;
    
    let totalDue = 0;
    let quantities = [];
    for(i = 0; i< products.length; i++){
      console.log(req.body);
      const quantityKey = `lineItems[${i}].quantity`;
      const quantity = req.body[quantityKey];
      console.log(quantity); // Array containing all lineItems' quantities
      console.log(products); // Array containing all lineItems' quantities

      let product = _productRepo.getProductById(products[i]);
      console.log(product); // Array containing all lineItems' quantities
      totalDue += (quantity * product.unitCost)
      console.log(totalDue); // Array containing all lineItems' quantities
      if (quantity) {
        quantities.push(quantity);
      }
    }
    console.log(`totalDue: ${totalDue}`); // Array containing all lineItems' quantities

    const newInvoiceData = {
      client: client,
      invoiceNumber: invoiceNumber,
      issueDate: issueDate,
      dueDate: dueDate,
      products: products,
      totalDue: totalDue,
      quantities: quantities
    };
    
    const createdInvoice = await _invoiceRepo.createInvoice(newInvoiceData);

    res.redirect("/invoices/"); // Redirect to the invoice index page
  } catch (error) {
    res.render("404", {
      title: "Error Creating Invoice",
      message: "Error fetching clients or products",
      error,
      contributors: contributors
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
      layout: "./layouts/full-width",
      contributors: contributors,
    });
  } else {
    // render 404 page
    console.log(`product ${request.params.id}'s record not found!`);
    response.render("404", {
      title: "Error Creating Invoice",
      message: "Error fetching clients or products",
      error,
      contributors: contributors
    });
  }
};
