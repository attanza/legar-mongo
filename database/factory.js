"use strict";

const Factory = use("Factory");

Factory.blueprint("App/Models/Product", faker => {
  const harga = faker.integer({ min: 30000, max: 50000 });
  const persentase = faker.integer({ min: 5, max: 40 });
  return {
    jenis_produk: faker.sentence({ words: 3 }),
    nama_produk: faker.sentence({ words: 5 }),
    ukuran: faker.sentence({ words: 2 }),
    harga_dasar: harga,
    harga_distributor: Math.floor(0.1 * harga + harga),
    harga_reseller: Math.floor(0.2 * harga + harga),
    rewards: true,
    jenis_rewards: faker.sentence({ words: 3 }),
    bonus_rewards: faker.integer({ min: 3000000, max: 5000000 }),
    or: true,
    persentase_or: persentase,
    bonus_or: Math.floor(0.1 * harga + harga * persentase)
  };
});
