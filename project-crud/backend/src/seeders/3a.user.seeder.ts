// seeders/YYYYMMDDHHMMSS-seed-users.ts
import { QueryInterface } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface: QueryInterface) {
  const now = new Date();
  await queryInterface.bulkInsert("users", [
    {
      id: uuidv4(),
      name: "fandy",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      name: "Bob",
      createdAt: now,
      updatedAt: now,
    },
  ]);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete("users", {});
}
