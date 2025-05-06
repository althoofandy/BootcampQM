import { QueryInterface } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default {
  up: async (queryInterface: QueryInterface) => {
    const dateNow = new Date();

    const categories = [
      {
        id: uuidv4(),
        name: "Electronics",
        createdAt: dateNow,
        updatedAt: dateNow,
      },
      {
        id: uuidv4(),
        name: "Fashion",
        createdAt: dateNow,
        updatedAt: dateNow,
      },
      {
        id: uuidv4(),
        name: "Books",
        createdAt: dateNow,
        updatedAt: dateNow,
      },
    ];

    await queryInterface.bulkInsert("categories", categories, {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("categories", {}, {});
  },
};
