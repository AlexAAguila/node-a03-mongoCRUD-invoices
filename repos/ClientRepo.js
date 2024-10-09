const mongoose = require("mongoose");

// import client model
const Client = require("../models/Client");

class ClientRepo {
  // empty constructor
  ClientRepo() {}

  // CRUD methods for interacting with DB

  // method for getting all clients
  async getAllClients() {
    try {
      console.log("getting all clients from Database");
      const clients = await Client.find({}).sort({ name: 1 });
      return clients;
    } catch (error) {
      return false;
    }
  }

  // Method for getting clients having some string in name
  async getClientsbyName(searchedName) {
    console.log(
      `finding search term ${searchedName} for name field in database`
    );
    try {
      // so, we will search a regex; $options indicates that search is case insensitive 
      const clients = await Client.find({
        name: { $regex: searchedName, $options: "i" },
      }).exec();
      console.log(`search successful!`);
      console.log(clients);
      return clients;
    } catch (error) {
      console.error("error resolving search", error.message);
      return false;
    }
  }

  // method for getting one client by id
  async getClientById(id) {
    try {
      console.log(`getting client ${id} from Database`);
      const client = await Client.findById(id);
      return client;
    } catch (error) {
      return false;
    }
  }

  // method for creating a new client
  async createClient(newClient) {
    try {
      // create a document using newClient object
      const newClientDoc = await Client.create(newClient);
      // check if the doc adheres to schema
      const error = await newClientDoc.validate();
      // if error quit and send error as response
      if (error) {
        console.error("error while validating", error);
        return "Error, please try again!";
      }
      // else save document
      console.log("saving client record");
      await newClientDoc.save();
      // return id of new client
      return newClientDoc._id.toString();
    } catch (error) {
      // display error and return with error message
      console.error("error creating client:", error);
      return "Could not create/update client due to error, Please try again!";
    }
  }

  // method for updating a client
  async updateClient(updatedClient) {
    const clientId = updatedClient.id;

    try {
      console.log(`getting client ${clientId} from Database`);
      const clientDoc = await this.getClientById(clientId);
      if (!clientDoc) {
        // if client does not exist send back false
        console.error("error in retrieving client");
        return false;
      }
      // if client exists update the client doc and save
      console.log(`updating doc: ${clientDoc._id}`);
      // save only relevant fields
      Object.assign(clientDoc, updatedClient);
      // saving client doc
      console.log("saving clientDoc");
      await clientDoc.save();
      // return true
      return true;
    } catch (error) {
      console.error("error updating client:", error.message);
      return false;
    }
  }

  // method for deleting a client
  async deleteClient(id, name) {
    try {
      console.log(`deleting client ${id}`);
      const deletedClient = await Client.findByIdAndDelete(id);
      console.log(`deleted client ${id}!`);
      return `Client ${name} deleted successfully!`;
    } catch (error) {
      console.error("Error while deleting:", error.message);
      return false;
    }
  }


  async getUserByEmail(email) {
    let user = await Client.findOne({ email: email });
    if (user) {
      const response = { obj: user, errorMessage: "" };
      return response;
    } else {
      return null;
    }
  }

  async getUserByUsername(username) {
    let user = await Client.findOne(
      { username: username },
      { _id: 1, username: 1, firstName: 1, lastName: 1, code: 1, company: 1, roles: 1 }
    );
    if (user) {
      const response = { user: user, errorMessage: "" };
      return response;
    } else {
      return null;
    }
  }
  
  async getRolesByUsername(username) {
    let user = await Client.findOne({ username: username }, { _id: 0, roles: 1 });
    if (user.roles) {
      return user.roles;
    } else {
      return [];
    }
  }

}

module.exports = ClientRepo;
