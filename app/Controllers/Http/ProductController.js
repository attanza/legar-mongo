"use strict";

const Product = use("App/Models/Product");

class ProductController {
  async index({ view }) {
    return view.render("products.index");
  }

  async show({ params, session, view, response }) {
    const id = params.id;
    const product = await Product.find(id);
    if (!product) {
      session
        .withErrors([{ field: "sessionError", message: "Product not found" }])
        .flashAll();
      return response.redirect("/manage/Products");
    }
    return view.render("Products.show", {
      product: product.toJSON()
    });
  }
}

module.exports = ProductController;
