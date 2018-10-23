"use strict";

const messages = require("./messages");

const { ResponseParser } = use("App/Helpers");

class UpdateUser {
  get rules() {
    const id = this.ctx.params.id;
    return {
      jenis_id: "required|max:20",
      no_id: `required|max:30|unique:users,no_id,id,${id}`,
      nama: "required|max:50",
      alamat: "max:250",
      telepon: `required|max:30|unique:users,telepon,id,${id}`,
      email: `required|email|unique:users,email,id,${id}`,
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

module.exports = UpdateUser;
