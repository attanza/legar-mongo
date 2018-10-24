"use strict";

const Schema = use("Schema");

class RoleSchema extends Schema {
  up() {
    this.create("roles", table => {
      table.increments();
      table
        .string("name")
        .notNullable()
        .unique()
        .index();
      table
        .string("slug")
        .notNullable()
        .unique()
        .index();
      table.string("description");

      table.timestamps();
    });
  }

  down() {
    this.drop("roles");
  }
}

module.exports = RoleSchema;
