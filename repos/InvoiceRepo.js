const Invoice = require("../models/Invoice.js");
const Product = require("../models/Product.js");
const Client = require("../models/Client.js");

class InvoiceRepo {
  ProductRepo() {}

  async getAllInvoices() {
    let invoices = await Invoice.find({});
    invoices.sort((a, b) => a.name.localeCompare(b.name));
    return invoices;
  }

  async getAllClients() {
    try {
      const clients = await Client.find({}); // Adjust this query based on your actual model
      return clients;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllProducts() {
    try {
      const products = await Product.find({}); // Adjust this query based on your actual model
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Your function to fetch data (example: findOne)
  async fetchData(id) {
    try {
      const result = await Invoice.findOne(id)
        .populate("email") // Using .populate() to include 'email' field from 'Client' model
        .exec();
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = InvoiceRepo;
