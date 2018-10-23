"use strict";

const Route = use("Route");
const { RedisHelper } = use("App/Helpers");

Route.on("/").render("welcome");
Route.get("logout", "AuthController.logout");

/**
 * Redis
 */

Route.get("redis/clear", async ({ response }) => {
  await RedisHelper.clear();
  return response.redirect("/manage");
});

Route.group(() => {
  Route.get("login", "AuthController.getLogin");
  Route.post("post-login", "AuthController.postLogin");
}).middleware(["guest"]);

Route.group(() => {
  Route.get("/", "DashboardController.index");
  Route.get("roles", "RoleController.index");
  Route.get("roles/:id", "RoleController.show");

  Route.get("users", "UserController.index");
  Route.get("users/:id", "UserController.show");

  Route.get("products", "ProductController.index");
  Route.get("products/:id", "ProductController.show");
})
  .prefix("manage")
  .middleware(["auth"]);
