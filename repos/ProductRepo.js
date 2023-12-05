const Product = require("../models/Product.js");

class ProductRepo {
  ProductRepo() { }

  async getAllProducts() {
    let products = await Product.find({});
    products.sort((a, b) => a.name.localeCompare(b.name));
    return products;
  }


  async getProductById(productId) {
    try {
      let product = await Product.findById(productId);
      return product;
    }
    catch(error){
      return false;
    }
  }

  async createProduct(productObj) {
    try {
      const error = await productObj.validateSync();
      if (error) {
        const response = {
          obj: productObj,
          errorMsg: error.message,
        };
        return response;
      }

      const result = await productObj.save();
      const response = {
        obj: result,
        errorMsg: "",
      };
      return response;
    } catch (error) {
      const response = {
        obj: productObj,
        errorMsg: error.message,
      };
      return response;
    }
  }

  // Method for getting products having some string in name
  async getProductsbyName(searchedName) {
    console.log(
      `finding search term ${searchedName} for name field in database`
    );
    try {
      // so, we will search a regex; $options indicates that search is case insensitive 
      const products = await Product.find({
        name: { $regex: searchedName, $options: "i" },
      }).exec();
      console.log(`search successful!`);
      console.log(products);
      return products;
    } catch (error) {
      console.error("error resolving search", error.message);
      return false;
    }
  }
  async deleteProductById(id) {
    console.log(`deleting product by id ${id}`);
    let result = await Product.findByIdAndDelete(id);
    console.log(result);
    return result;
  }

  async updateProductById(id, productObj) {
    console.log(`updating profile by id ${id}`);
    const product = await Product.findById(id);
    console.log("original profile: ", product);
    product.name = productObj.name;
    product.code = productObj.code;
    product.unitCost = productObj.unitCost;
    let result = await product.save();
    console.log("updated profile: ", result);
    return {
      obj: result,
      errorMsg: "",
    };
  }
}



module.exports = ProductRepo;
