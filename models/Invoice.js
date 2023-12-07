"use strict"
const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }],
  },
  { collection: "invoice" }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
