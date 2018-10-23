"use strict";

const User = use("App/Models/User");
const Role = use("App/Models/Role");
const Database = use("Database");
const changeCase = require("change-case");
const Chance = require("chance");
const chance = new Chance();
const { RedisHelper } = use("App/Helpers");
const roles = [
  "Super user",
  "Administrator",
  "Vendor Sales Admin",
  "Nevenblue Admin",
  "Distributor",
  "Reseller",
  "Agen"
];

class UserSeeder {
  async run() {
    const mongoClient = await Database.connect();
    await mongoClient.collection("users").remove();
    await mongoClient.collection("role_user").remove();
    await mongoClient.collection("roles").remove();
    await RedisHelper.clear();

    roles.map(async role => {
      let roleData = await Role.create({
        name: role,
        slug: changeCase.paramCase(role)
      });

      let user = await User.create({
        jenis_id: "KTP",
        no_id: chance.bb_pin(),
        nama: role,
        alamat: chance.address(),
        telepon: chance.phone(),
        email: changeCase.snakeCase(role) + "@legar.com",
        password: "password",
        is_active: true
      });
      await user.roles().attach([roleData._id]);
    });
  }
}

module.exports = UserSeeder;
