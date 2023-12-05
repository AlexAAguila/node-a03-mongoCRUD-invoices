const mongoose = require("mongoose");

// create a schema
const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    company:{
      type:String,
      required:true,
    },
    // company: String,
    email: {
      type: String,
      required: true,
    },
  },
  { collection: "clients" }
);

// create a model
const Client = mongoose.model("Client", clientSchema);

// export the model
module.exports = Client;