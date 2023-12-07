const Invoice = require("../models/Invoice.js");

class InvoiceRepo {
  ProductRepo() { }

  async getAllInvoices() {
    let invoices = await Invoice.find({});
    invoices.sort((a, b) => a.name.localeCompare(b.name));
    return invoices;
  }


// Your function to fetch data (example: findOne)
async fetchData(id) {
  try {
    const result = await Invoice.findOne(id)
      .populate('email') // Using .populate() to include 'email' field from 'Client' model
      .exec();
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
}

module.exports = InvoiceRepo;
