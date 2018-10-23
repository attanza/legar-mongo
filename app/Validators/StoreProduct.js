"use strict";

const messages = require("./messages");

const { ResponseParser } = use("App/Helpers");

class StoreProduct {
  get rules() {
    return {
      jenis_produk: "required|max:50",
      nama_produk: "required|max:50|unique:products",
      ukuran: "required|max:50",
      harga_dasar: "required|integer",
      harga_distributor: "required|integer",
      harga_reseller: "required|integer",
      rewards: "boolean",
      jenis_rewards: "max:50",
      bonus_rewards: "integer",
      or: "boolen",
      persentase_or: "integer",
      bonus_or: "integer"
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

module.exports = StoreProduct;
