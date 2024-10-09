const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// create a schema
const clientSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    // code: {
    //   type: String,
    //   required: true,
    // },
    // company:{
    //   type:String,
    //   required:true,
    // },
    // company: String,
    // email: {
    //   type: String,
    //   required: true,
    // },
    password: {
      type: String,
    },
    roles: {
      type: Array,
      default: ["None"]
    },
  },
  { collection: "clients" }
);
// Add passport-local-mongoose to our Schema
clientSchema.plugin(passportLocalMongoose);
// create a model
const Client = mongoose.model("Client", clientSchema);

// export the model
module.exports = Client;