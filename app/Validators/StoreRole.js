"use strict";

const messages = require("./messages");

const { ResponseParser } = use("App/Helpers");

class StoreRole {
  get rules() {
    return {
      name: "required|max:50|unique:roles",
      slug: "required|max:50|unique:roles",
      description: "string|max:250"
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

module.exports = StoreRole;
