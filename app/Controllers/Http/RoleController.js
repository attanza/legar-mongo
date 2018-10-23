"use strict";

const Role = use("App/Models/Role");

/**
 * Resourceful controller for interacting with roles
 */
class RoleController {
  /**
   * Show a list of all roles.
   * GET roles
   */
  async index({ view }) {
    return view.render("roles.index");
  }

  /**
   * Display a single role.
   * GET roles/:id
   */
  async show({ params, session, view }) {
    const id = params.id;
    const role = await Role.find(id);
    if (!role) {
      session
        .withErrors([{ field: "sessionError", message: "Role not found" }])
        .flashAll();
      return response.redirect("/manage/roles");
    }
    console.log("role", role.toJSON()); //eslint-disable-line
    return view.render("roles.show", {
      role: role.toJSON()
    });
  }
}

module.exports = RoleController;
