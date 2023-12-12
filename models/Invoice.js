"use strict";
const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },

    invoiceNumber: {
      type: Number,
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
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    quantities: [
      {
        type: Number,
        required: false
      }
    ],
    totalDue: {
      type: Number,
      required: false
    }
  },
  { collection: "invoice" }
);
const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
