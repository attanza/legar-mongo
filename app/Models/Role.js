"use strict";

const Model = use("Model");

class Role extends Model {
  // static boot() {
  //   super.boot();
  //   this.addTrait("@provider:Lucid/Slugify", {
  //     fields: { slug: "name" },
  //     strategy: "dbIncrement",
  //     disableUpdates: false
  //   });
  // }
}

module.exports = Role;
