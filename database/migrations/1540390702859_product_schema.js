"use strict";

const Schema = use("Schema");

class ProductSchema extends Schema {
  up() {
    this.create("products", table => {
      table.increments();
      table.string("jenis_produk").notNullable();
      table
        .string("nama_produk")
        .notNullable()
        .unique()
        .index();
      table.string("ukuran").notNullable();
      table.integer("harga_dasar");
      table.integer("harga_distributor");
      table.integer("harga_reseller");
      table.boolean("rewards").default(false);
      table.string("jenis_rewards");
      table.string("bonus_rewards");
      table.boolean("or");
      table.integer("persentase_or");
      table.integer("bonus_or");

      table.timestamps();
    });
  }

  down() {
    this.drop("products");
  }
}

module.exports = ProductSchema;
