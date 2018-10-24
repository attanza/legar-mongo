"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", table => {
      table.increments();
      table.string("jenis_id").notNullable();
      table
        .string("no_id")
        .notNullable()
        .unique()
        .index();
      table.string("nama").notNullable();
      table.string("password").notNullable();
      table.string("alamat");
      table.string("area");
      table
        .string("telepon")
        .notNullable()
        .unique()
        .index();
      table
        .string("email")
        .notNullable()
        .unique()
        .index();
      table.string("reveal_id");
      table.string("jenis_keagenan");
      table.string("status_keagenan");
      table.string("jabatan");
      table.boolean("is_active").default(false);
      table.timestamps();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;
