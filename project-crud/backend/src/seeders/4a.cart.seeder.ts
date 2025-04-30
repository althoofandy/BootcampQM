import { QueryInterface, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface: QueryInterface, sequelize: Sequelize) {
  const now = new Date();

  // Ambil semua user dan product
  const [users]: any[] = await queryInterface.sequelize.query(
    `SELECT id FROM users;`
  );

  const [products]: any[] = await queryInterface.sequelize.query(
    `SELECT id, price FROM products;`
  );

  // Pastikan ada data
  if (users.length < 2 || products.length < 2) return;

  await queryInterface.bulkInsert("carts", [
    {
      id: uuidv4(),
      userId: users[0].id,
      productId: products[0].id,
      quantity: 2,
      totalPrice: products[0].price * 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      userId: users[1].id,
      productId: products[1].id,
      quantity: 1,
      totalPrice: products[1].price * 1,
      createdAt: now,
      updatedAt: now,
    },
  ]);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete("carts", {});
}
