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
    try {
      await User.truncate();
      await Role.truncate();
      await RedisHelper.clear();
      await Database.table("role_user").truncate();
      for (let i = 0; i < roles.length; i++) {
        let role = await Role.create({
          name: roles[i],
          slug: changeCase.paramCase(roles[i])
        });
        let user = await User.create({
          jenis_id: "KTP",
          no_id: chance.bb_pin(),
          nama: roles[i],
          alamat: chance.address(),
          telepon: chance.phone(),
          email: changeCase.snakeCase(roles[i]) + "@legar.com",
          password: "password",
          is_active: true
        });
        await user.roles().attach([role.id]);
      }
    } catch (e) {
      console.log("e", e); //eslint-disable-line
    }
  }
}

module.exports = UserSeeder;
