const Product = require("../models/Product");

const ProductRepo = require("../repos/ProductRepo");

const RequestService = require("../services/RequestService");


const _productRepo = new ProductRepo();

// Import packageReader and get contributors
const packageReader = require("../packageReader");
const contributors = packageReader.getContributors();

exports.Index = async function (request, response) {
  let reqInfo = RequestService.reqHelper(request, ["Admin"]);
  if (reqInfo.rolePermitted) {
    let products = await _productRepo.getAllProducts();
  // check for any query parameters
  const { searchedName } = request.query;
  // if there is a query parameter
  if (searchedName) {
    console.log("fetching data for search term from controller");
    // get results for this search param from repo
    products = await _productRepo.getProductsbyName(searchedName);
  } else {
    console.log("fetching all clients data from controller");
    // get all products from repo
    products = await _productRepo.getAllProducts();
  }
  if (products) {
    response.render("productsIndex", {
      title: "Express Billing - Products",
      products: products,
      reqInfo: reqInfo,
      contributors: contributors,
    });
  } else {
    response.render("productsIndex", {
      title: "Express Billing - Products",
      products: [],
      reqInfo: reqInfo,
      contributors: contributors,
    });
  }
}
else {
  response.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};

exports.Detail = async function (request, response) {
  let reqInfo = RequestService.reqHelper(request, ["Admin"]);
  if (reqInfo.rolePermitted) {

  const productId = request.params.id;
  let product = await _productRepo.getProductById(productId);
  let products = await _productRepo.getAllProducts();
  if (product) {
    // render product details page and send this product doc object
    response.render("productDetails", {
      title: "Express Billing - " + product.name,
      products: products,
      reqInfo: reqInfo,
      productId: request.params.id,
      layout: "./layouts/full-width",
      contributors: contributors,
    });
  } else {
    // render 404 page
    console.log(`product ${request.params.id}'s record not found!`);
    response.render("404", {
      title: `Express Billing Page Not Found`,
      contributors: contributors,
      reqInfo: reqInfo,
    });
  }
}
else {
  response.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};

// Handle product form GET request
exports.Create = async function (request, response) {
  let reqInfo = RequestService.reqHelper(request, ["Admin"]);
  if (reqInfo.rolePermitted) {

  response.render("productCreate", {
    title: "Create Product",
    errorMessage: "",
    product_id: null,
    product: {},
    reqInfo: reqInfo,
    contributors: contributors,
  });
}
else {
  response.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};

// Handle product form GET request
exports.CreateProduct = async function (request, response) {
  // instantiate a new product object populated with form data
  
  let reqInfo = RequestService.reqHelper(request, ["Admin"]);
  if (reqInfo.rolePermitted) {

  let tempProductObj = new Product({
    name: request.body.name,
    code: request.body.code,
    unitCost: request.body.unitCost,
  });

  let responseObj = await _productRepo.createProduct(tempProductObj);

  if (responseObj.errorMsg == "") {
    console.log(responseObj.obj);
    // Redirect to the product detail page
    response.redirect("/products/" + responseObj.obj._id); 
  } else {
    // render form again with filled fields
    console.log("An error occurred. Item not created.");
    response.render("productCreate", {
      title: "Create Product",
      product: responseObj.obj,
      contributors: contributors,
      reqInfo: reqInfo,
      errorMessage: responseObj.errorMsg,
    });
  }
}
else {
  response.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};

// Handle product form delete request
exports.DeleteProductById = async function (request, response) {
  let reqInfo = RequestService.reqHelper(request, ["Admin"]);
  if (reqInfo.rolePermitted) {
    const productId = request.params.id;
  let deletedProduct = await _productRepo.deleteProductById(productId);
  let products = await _productRepo.getAllProducts();

  if (deletedProduct) {
    // if delete is successful go to products page
    response.redirect("/products");
  } else {
    // else render productIndex page
    response.render("productsIndex", {
      title: "Express Billing - Products",
      products: products,
      errorMessage: "Error.  Unable to Delete",
      reqInfo: reqInfo,
      contributors: contributors,
    });
  }
}
else {
  response.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};


// Handle edit product form GET request
exports.Edit = async function (request, response) {
  let reqInfo = RequestService.reqHelper(request, ["Admin"]);
  if (reqInfo.rolePermitted) {
    const productId = request.params.id;

  let product = await _productRepo.getProductById(productId);
  response.render("productForm", {
    title: "Express Billing - " + product.name,
    errorMessage: "",
    productId: request.params.id,
    products: product,
    reqInfo: reqInfo,
    layout: "./layouts/full-width",
    contributors: contributors,
  });
}else {
  response.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};

// Handle product edit form submission
exports.EditProduct = async function (request, response) {
  let reqInfo = RequestService.reqHelper(request, ["Admin"]);
  if (reqInfo.rolePermitted) {
    const productId = request.body.productId;

  let tempProductObj = new Product({
    name: request.body.name,
    code: request.body.code,
    unitCost: request.body.unitCost,
  });

  // send these to productrepo to update and save the document
  let responseObj = await _productRepo.updateProductById(productId, tempProductObj);

  // if no errors, save was successful
  if (responseObj.errorMsg == "") {
    // Redirect to the product detail page
    response.redirect("/products/" + responseObj.obj._id); 
  }
  // There are errors. Show form the again with an error message.
  else {
    console.log("An error occured. Item not created.");
    let product = await _productRepo.getProductById(productId);
    response.render("productForm", {
      title: "Express Billing - " + product.name,
      productId: request.params.id,
      products: product,
      layout: "./layouts/full-width",
      reqInfo: reqInfo,
      contributors: contributors,
      errorMessage: responseObj.errorMsg,
    });
  }
}
else {
  response.redirect(
    "/user/login?errorMessage=You must be logged in to view this page."
  );
}
};