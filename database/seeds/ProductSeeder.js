"use strict";

const Database = use("Database");

const Factory = use("Factory");

class ProductSeeder {
  async run() {
    const mongoClient = await Database.connect();
    await mongoClient.collection("products").remove();
    await Factory.model("App/Models/Product").createMany(5);
  }
}

module.exports = ProductSeeder;
