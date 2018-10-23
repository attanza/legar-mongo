"use strict";

const messages = require("./messages");

const { ResponseParser } = use("App/Helpers");

class UpdateRole {
  get rules() {
    const id = this.ctx.params.id;

    return {
      name: `required|max:50|unique:roles,name,id,${id}`,
      slug: `required|max:50,name,id,${id}`,
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

module.exports = UpdateRole;
