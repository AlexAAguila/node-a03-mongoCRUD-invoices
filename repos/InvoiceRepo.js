const Invoice = require("../models/Invoice.js");
const Product = require("../models/Product.js");
const Client = require("../models/Client.js");

class InvoiceRepo {
  ProductRepo() {}

  async getAllInvoices() {
    try {
      const invoices = await Invoice.find({})
        .populate("client")
        .sort({ invoiceNumber: 1 });
      return invoices;
    } catch (error) {
      throw new Error("Error fetching invoices: " + error.message);
    }
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
      console.log(products);
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createInvoice(data) {
    try {
      const newInvoice = new Invoice(data);
      const savedInvoice = await newInvoice.save();
      return savedInvoice;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProductById(id) {
    console.log(`deleting invoice by id ${id}`);
    let result = await Invoice.findByIdAndDelete(id);
    console.log(result);
    return result;
  }

  async fetchInvoiceById(id) {
    try {
      const invoice = await Invoice.findById(id)
        .populate("client") // Populate the 'client' field with client details
        .populate("products") // Populate the 'products' array with product details
        .exec();

      return invoice;
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

 // Inside the repo file
async getInvoicebyId(searchedId) {
  console.log(`finding search term ${searchedId} for invoiceNumber field in the database`);
  try {
    const parsedId = isNaN(searchedId) ? searchedId : parseInt(searchedId);
    const invoices = await Invoice.find({
      invoiceNumber: isNaN(parsedId) ? { $regex: searchedId, $options: "i" } : parsedId,
    })
    .populate("client");
    console.log(`search successful!`);
    console.log(invoices);
    return invoices;
  } catch (error) {
    console.error("error resolving search", error.message);
    return false;
  }
}

}



module.exports = InvoiceRepo;
