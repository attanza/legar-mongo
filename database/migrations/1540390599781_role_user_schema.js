"use strict";

const Schema = use("Schema");

class RoleUserSchema extends Schema {
  up() {
    this.create("role_user", table => {
      table.increments();
      table.integer("user_id").unsigned();
      table.integer("role_id").unsigned();
      table.timestamps();
    });
  }

  down() {
    this.drop("role_user");
  }
}

module.exports = RoleUserSchema;
