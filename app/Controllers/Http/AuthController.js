"use strict";

const User = use("App/Models/User");

class AuthController {
  async getLogin({ view }) {
    return view.render("auth.login");
  }

  async postLogin({ request, response, auth, session }) {
    try {
      const { email, password } = request.post();
      const user = await User.findBy("email", email);
      if (!user) {
        throw "Login Failed";
      }

      if (!user.is_active) {
        throw "Login Failed";
      }
      await auth.attempt(email, password);

      return response.redirect("/manage");
    } catch (e) {
      session
        .withErrors([{ field: "loginFailed", message: "Login Failed" }])
        .flashAll();
      return response.redirect("/login");
    }
  }

  async logout({ response, auth }) {
    await auth.logout();
    return response.redirect("/login");
  }
}

module.exports = AuthController;
