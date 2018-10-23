"use strict";

const User = use("App/Models/User");
const { RedisHelper, ResponseParser } = use("App/Helpers");
const { ActivityTraits } = use("App/Traits");

const fillable = [
  "jenis_id",
  "no_id",
  "nama",
  "alamat",
  "telepon",
  "email",
  "is_active"
];

class UserController {
  /**
   * Index
   * Get List of User
   */
  async index({ request, response }) {
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
      const data = await User.where({
        $or: [
          { jenis_id: { $regex: search, $options: "i" } },
          { no_id: { $regex: search, $options: "i" } },
          { nama: { $regex: search, $options: "i" } },
          { telepon: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      }).paginate(parseInt(page), parseInt(limit));
      let parsed = ResponseParser.apiCollection(data.toJSON());
      return response.status(200).send(parsed);
    }
    const redisKey = `User_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}`;

    let cached = await RedisHelper.get(redisKey);

    if (cached) {
      return response.status(200).send(cached);
    }

    const data = await User.query()
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
   * Store New User
   */
  async store({ request, response, auth }) {
    let body = request.only(fillable);
    let { password } = request.post();
    body.password = password;
    const data = await User.create(body);
    await RedisHelper.delete("User_*");
    const activity = `Add new User '${data.nama}'`;
    await ActivityTraits.saveActivity(request, auth, activity);
    let parsed = ResponseParser.apiCreated(data.toJSON());
    return response.status(201).send(parsed);
  }

  /**
   * Show
   * User by id
   */
  async show({ request, response }) {
    const id = request.params.id;
    let redisKey = `User_${id}`;
    let cached = await RedisHelper.get(redisKey);
    if (cached) {
      return response.status(200).send(cached);
    }
    const data = await User.find(id);
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound());
    }
    let parsed = ResponseParser.apiItem(data.toJSON());
    await RedisHelper.set(redisKey, parsed);
    return response.status(200).send(parsed);
  }

  /**
   * Update
   * Update User by Id
   */
  async update({ request, response, auth }) {
    let body = request.only(fillable);
    const id = request.params.id;
    const data = await User.find(id);
    if (!data || data.length === 0) {
      return response.status(400).send(ResponseParser.apiNotFound());
    }
    await data.merge(body);
    await data.save();
    const activity = `Update User '${data.nama}'`;
    await ActivityTraits.saveActivity(request, auth, activity);
    await RedisHelper.delete("User_*");
    let parsed = ResponseParser.apiUpdated(data.toJSON());
    return response.status(200).send(parsed);
  }

  /**
   * Delete
   * Delete User by Id
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id;
    const data = await User.find(id);
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound());
    }
    const activity = `Delete User '${data.nama}'`;
    await ActivityTraits.saveActivity(request, auth, activity);
    await RedisHelper.delete("User*");
    await data.delete();
    return response.status(200).send(ResponseParser.apiDeleted());
  }

  async me({ response, auth }) {
    const user = await auth.getUser();
    return response.status(200).send(user);
  }
}

module.exports = UserController;
