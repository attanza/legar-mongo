"use strict";

const { Command } = require("@adonisjs/ace");
const changeCase = require("change-case");
const ace = require("@adonisjs/ace");
const Helpers = use("Helpers");

class Service extends Command {
  static get signature() {
    return "make:service";
  }

  static get description() {
    return "Create Service Starter";
  }

  async handle() {
    const name = await this.ask("Enter service name");
    const upperName = changeCase.upperCaseFirst(name);
    const lowerName = changeCase.lowerCase(name);
    await ace.call("make:model", { name: upperName }, { controller: true });
    await ace.call("make:controller", { name: `Api/${upperName}s` });
    await ace.call("make:validator", { name: `Store${upperName}` });
    await ace.call("make:validator", { name: `Update${upperName}` });
    await ace.call("make:seed", { name: `${upperName}Seeder` });
    await ace.call("make:view", { name: `${lowerName}s/index` });
    await ace.call("make:view", { name: `${lowerName}s/show` });

    await this.writeFile(
      Helpers.appRoot(`resources/assets/js/pages/${lowerName}s.vue`)
    );
  }
}

module.exports = Service;
