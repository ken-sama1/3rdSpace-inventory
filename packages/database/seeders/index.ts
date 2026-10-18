import { seedInventoryItems } from "./seed-inventory-items.js";
import { seedUsers } from "./seed-users.js";

const main = async () => {
  console.time("seeder");

  await seedUsers();
  await seedInventoryItems();

  console.timeEnd("seeder");
};

main().catch((err) => console.log(err));
