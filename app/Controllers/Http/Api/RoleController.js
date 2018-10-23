"use strict";

const Role = use("App/Models/Role");
const { RedisHelper, ResponseParser } = use("App/Helpers");
const { ActivityTraits } = use("App/Traits");

const fillable = ["name", "slug", "description"];

class RoleController {
  /**
   * Index
   * Get List of Role
   */
  async index({ request, response }) {
    // const data = await RoleQueryTrait(request)
    // let parsed = ResponseParser.apiCollection(data)
    // return response.status(200).send(parsed)

    let {
      page,
      limit,
      search,
      search_by,
      search_query,
      between_date,
      start_date,
      end_date,
      sort_by,
      sort_mode
    } = request.get();

    if (!page) page = 1;
    if (!limit) limit = 10;
    if (!sort_by) sort_by = "id";
    if (!sort_mode) sort_mode = "desc";

    if (search && search != "") {
      const data = await Role.where("name", {
        $regex: search,
        $options: "i"
      }).paginate(parseInt(page), parseInt(limit));
      let parsed = ResponseParser.apiCollection(data.toJSON());
      return response.status(200).send(parsed);
    }

    const redisKey = `Role_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}`;

    let cached = await RedisHelper.get(redisKey);

    if (cached) {
      return response.status(200).send(cached);
    }

    const data = await Role.query()
      .where(function() {
        if (search_by && search_query) {
          return this.where(search_by, "like", `%${search_query}%`);
        }
      })
      .where(function() {
        if (between_date && start_date && end_date) {
          return this.whereBetween(between_date, [start_date, end_date]);
        }
      })
      .orderBy(sort_by, sort_mode)
      .paginate(parseInt(page), parseInt(limit));

    let parsed = ResponseParser.apiCollection(data.toJSON());
    await RedisHelper.set(redisKey, parsed);
    return response.status(200).send(parsed);
  }

  /**
   * Store
   * Store New Role
   */
  async store({ request, response, auth }) {
    let body = request.only(fillable);
    const data = await Role.create(body);
    await RedisHelper.delete("Role_*");
    const activity = `Add new Role '${data.name}'`;
    await ActivityTraits.saveActivity(request, auth, activity);
    let parsed = ResponseParser.apiCreated(data.toJSON());
    return response.status(201).send(parsed);
  }

  /**
   * Show
   * Role by id
   */
  async show({ request, response }) {
    const id = request.params.id;
    let redisKey = `Role_${id}`;
    let cached = await RedisHelper.get(redisKey);
    if (cached) {
      return response.status(200).send(cached);
    }
    const data = await Role.find(id);
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound());
    }
    let parsed = ResponseParser.apiItem(data.toJSON());
    await RedisHelper.set(redisKey, parsed);
    return response.status(200).send(parsed);
  }

  /**
   * Update
   * Update Role by Id
   */
  async update({ request, response, auth }) {
    let body = request.only(fillable);
    const id = request.params.id;
    const data = await Role.find(id);
    if (!data || data.length === 0) {
      return response.status(400).send(ResponseParser.apiNotFound());
    }
    await data.merge(body);
    await data.save();
    const activity = `Update Role '${data.name}'`;
    await ActivityTraits.saveActivity(request, auth, activity);
    await RedisHelper.delete("Role_*");
    let parsed = ResponseParser.apiUpdated(data.toJSON());
    return response.status(200).send(parsed);
  }

  /**
   * Delete
   * Delete Role by Id
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id;
    const data = await Role.find(id);
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound());
    }
    const activity = `Delete Role '${data.name}'`;
    await ActivityTraits.saveActivity(request, auth, activity);
    await RedisHelper.delete("Role*");
    await data.delete();
    return response.status(200).send(ResponseParser.apiDeleted());
  }
}

module.exports = RoleController;
