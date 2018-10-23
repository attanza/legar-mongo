"use strict";

const Product = use("App/Models/Product");
const { RedisHelper, ResponseParser } = use("App/Helpers");
const { ActivityTraits } = use("App/Traits");

const fillable = [
  "jenis_produk",
  "nama_produk",
  "ukuran",
  "harga_dasar",
  "harga_distributor",
  "harga_reseller",
  "rewards",
  "jenis_rewards",
  "bonus_rewards",
  "or",
  "persentase_or",
  "bonus_or"
];

class ProductController {
  /**
   * Index
   * Get List of Product
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
      const data = await Product.where({
        $or: [
          { jenis_produk: { $regex: search, $options: "i" } },
          { nama_produk: { $regex: search, $options: "i" } },
          { ukuran: { $regex: search, $options: "i" } },
          { harga_dasar: { $regex: search, $options: "i" } },
          { harga_distributor: { $regex: search, $options: "i" } },
          { harga_reseller: { $regex: search, $options: "i" } }
        ]
      }).paginate(parseInt(page), parseInt(limit));
      let parsed = ResponseParser.apiCollection(data.toJSON());
      return response.status(200).send(parsed);
    }
    const redisKey = `Product_${page}${limit}${sort_by}${sort_mode}${search_by}${search_query}${between_date}${start_date}${end_date}`;

    let cached = await RedisHelper.get(redisKey);

    if (cached) {
      return response.status(200).send(cached);
    }

    const data = await Product.query()
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
   * Store New Product
   */
  async store({ request, response, auth }) {
    let body = request.only(fillable);
    const data = await Product.create(body);
    await RedisHelper.delete("Product_*");
    const activity = `Add new Product '${data.nama}'`;
    await ActivityTraits.saveActivity(request, auth, activity);
    let parsed = ResponseParser.apiCreated(data.toJSON());
    return response.status(201).send(parsed);
  }

  /**
   * Show
   * Product by id
   */
  async show({ request, response }) {
    const id = request.params.id;
    let redisKey = `Product_${id}`;
    let cached = await RedisHelper.get(redisKey);
    if (cached) {
      return response.status(200).send(cached);
    }
    const data = await Product.find(id);
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound());
    }
    let parsed = ResponseParser.apiItem(data.toJSON());
    await RedisHelper.set(redisKey, parsed);
    return response.status(200).send(parsed);
  }

  /**
   * Update
   * Update Product by Id
   */
  async update({ request, response, auth }) {
    let body = request.only(fillable);
    const id = request.params.id;
    const data = await Product.find(id);
    if (!data || data.length === 0) {
      return response.status(400).send(ResponseParser.apiNotFound());
    }
    await data.merge(body);
    await data.save();
    const activity = `Update Product '${data.nama}'`;
    await ActivityTraits.saveActivity(request, auth, activity);
    await RedisHelper.delete("Product_*");
    let parsed = ResponseParser.apiUpdated(data.toJSON());
    return response.status(200).send(parsed);
  }

  /**
   * Delete
   * Delete Product by Id
   */
  async destroy({ request, response, auth }) {
    const id = request.params.id;
    const data = await Product.find(id);
    if (!data) {
      return response.status(400).send(ResponseParser.apiNotFound());
    }
    const activity = `Delete Product '${data.nama}'`;
    await ActivityTraits.saveActivity(request, auth, activity);
    await RedisHelper.delete("Product*");
    await data.delete();
    return response.status(200).send(ResponseParser.apiDeleted());
  }
}

module.exports = ProductController;
