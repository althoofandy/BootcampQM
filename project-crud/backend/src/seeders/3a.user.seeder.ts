// seeders/YYYYMMDDHHMMSS-seed-users.ts
import { QueryInterface } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export async function up(queryInterface: QueryInterface) {
  const now = new Date();
  const saltRounds = 10;

  // Hash password untuk semua user
  const hashedPassword1 = await bcrypt.hash("password123", saltRounds);
  const hashedPassword2 = await bcrypt.hash("securepass456", saltRounds);
  const hashedPassword3 = await bcrypt.hash("adminpass789", saltRounds);

  await queryInterface.bulkInsert("users", [
    {
      id: uuidv4(),
      username: "fandy",
      password: hashedPassword1,
      role: "customer",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      username: "bob_marley",
      password: hashedPassword2,
      role: "customer",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      username: "admin_user",
      password: hashedPassword3,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    },
  ]);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete("users", {});
}
