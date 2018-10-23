"use strict";

const messages = require("./messages");

const { ResponseParser } = use("App/Helpers");

class StoreUser {
  get rules() {
    return {
      jenis_id: "required|max:20",
      no_id: "required|max:30|unique:users",
      nama: "required|max:50",
      alamat: "max:250",
      telepon: "required|max:30|unique:users",
      email: "required|email|unique:users",
      password: "required|min:6",
      is_active: "boolean"
    };
  }

  get messages() {
    return messages;
  }

  async fails(errorMessages) {
    return this.ctx.response
      .status(422)
      .send(ResponseParser.apiValidationFailed(errorMessages));
  }
}

module.exports = StoreUser;
