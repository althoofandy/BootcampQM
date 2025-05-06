import { QueryInterface } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default {
  up: async (queryInterface: QueryInterface) => {
    const dateNow = new Date();

    // Solusi 1: Ambil user pertama
    const users: any = await queryInterface.sequelize.query(
      "SELECT id FROM users LIMIT 1;"
    );

    if (!users[0]?.length) {
      throw new Error("No user found");
    }

    const userId = users[0][0].id;

    const transactions = [
      {
        id: uuidv4(),
        totalPrice: 9990000,
        cashierId: userId,
        createdAt: dateNow,
        updatedAt: dateNow,
      },
      {
        id: uuidv4(),
        totalPrice: 1750000,
        cashierId: userId,
        createdAt: dateNow,
        updatedAt: dateNow,
      },
    ];

    await queryInterface.bulkInsert("transactions", transactions, {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("transactions", {}, {});
  },
};
