import { QueryInterface, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    const products = [
      {
        id: uuidv4(),
        name: "Product A",
        price: 10000,
        category: "Electronics",
        stock: 50,
        isCart: false,
        description: "High-quality electronic device with premium features.",
        image: "https://source.unsplash.com/400x300/?electronics",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Product B",
        price: 20000,
        category: "Books",
        stock: 30,
        isCart: false,
        description: "Bestselling novel with gripping story and characters.",
        image: "https://source.unsplash.com/400x300/?book",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Product C",
        price: 5000,
        category: "Stationery",
        stock: 100,
        isCart: false,
        description: "Complete set of office stationery for daily use.",
        image: "https://source.unsplash.com/400x300/?stationery",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Product D",
        price: 15000,
        category: "Fashion",
        stock: 20,
        isCart: false,
        description: "Trendy fashion wear for casual and formal occasions.",
        image: "https://source.unsplash.com/400x300/?fashion",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Product E",
        price: 30000,
        category: "Gadgets",
        stock: 10,
        isCart: false,
        description: "Latest gadget with smart technology features.",
        image: "https://source.unsplash.com/400x300/?gadget",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("products", products, {});
  },

  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    await queryInterface.bulkDelete("products", {});
  },
};
