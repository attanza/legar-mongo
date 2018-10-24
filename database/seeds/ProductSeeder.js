"use strict";

const Database = use("Database");
const Product = use("App/Models/Product");
const Factory = use("Factory");

class ProductSeeder {
  async run() {
    try {
      await Product.truncate();
      await Factory.model("App/Models/Product").createMany(5);
    } catch (e) {
      console.log("e", e); //eslint-disable-line
    }
  }
}

module.exports = ProductSeeder;
