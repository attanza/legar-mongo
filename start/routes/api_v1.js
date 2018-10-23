"use strict";

const Route = use("Route");

Route.group(() => {
  Route.get("me", "UserController.me");

  /**
   * Roles
   */
  Route.resource("roles", "RoleController")
    .apiOnly()
    .validator(
      new Map([
        [["roles.store"], ["StoreRole"]],
        [["roles.update"], ["UpdateRole"]]
      ])
    );

  /**
   * Users
   */
  Route.resource("users", "UserController")
    .apiOnly()
    .validator(
      new Map([
        [["users.store"], ["StoreUser"]],
        [["users.update"], ["UpdateUser"]]
      ])
    );

  /**
   * Products
   */
  Route.resource("products", "ProductController")
    .apiOnly()
    .validator(
      new Map([
        [["products.store"], ["StoreProduct"]],
        [["products.update"], ["UpdateProduct"]]
      ])
    );
})
  .namespace("Api")
  .prefix("api/v1")
  .formats(["json"])
  .middleware(["auth"]);
