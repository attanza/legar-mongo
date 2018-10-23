"use strict";

const User = use("App/Models/User");

class UserController {
  async index({ view }) {
    return view.render("users.index");
  }

  async show({ params, session, view, response }) {
    const id = params.id;
    const user = await User.find(id);
    if (!user) {
      session
        .withErrors([{ field: "sessionError", message: "User not found" }])
        .flashAll();
      return response.redirect("/manage/users");
    }
    return view.render("users.show", {
      user: user.toJSON()
    });
  }
}

module.exports = UserController;
