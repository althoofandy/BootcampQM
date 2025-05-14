import { v4 as uuidv4 } from "uuid";
export default {
    async up(queryInterface) {
        const dateNow = new Date();
        const categories = await queryInterface.sequelize.query("SELECT id, name FROM categories;");
        const categoryMap = {};
        categories[0].forEach((category) => {
            categoryMap[category.name] = category.id;
        });
        const products = [
            {
                id: uuidv4(),
                name: "Smartphone X",
                price: 7990000,
                categoryId: categoryMap["Electronics"],
                description: "Flagship phone with awesome camera",
                image: "https://picsum.photos/seed/smartphone/400/300",
                stock: 50,
                isCart: false,
            },
            {
                id: uuidv4(),
                name: "Smartwatch Y",
                price: 2500000,
                categoryId: categoryMap["Electronics"],
                description: "Smartwatch with fitness tracking",
                image: "https://picsum.photos/seed/smartwatch/400/300",
                stock: 30,
                isCart: false,
            },
            {
                id: uuidv4(),
                name: "Bluetooth Headphones",
                price: 1500000,
                categoryId: categoryMap["Electronics"],
                description: "Noise-cancelling over-ear headphones",
                image: "https://picsum.photos/seed/headphones/400/300",
                stock: 60,
                isCart: false,
            },
            {
                id: uuidv4(),
                name: "4K LED TV",
                price: 8990000,
                categoryId: categoryMap["Electronics"],
                description: "Ultra HD Smart TV 55 inch",
                image: "https://picsum.photos/seed/tv/400/300",
                stock: 15,
                isCart: false,
            },
            {
                id: uuidv4(),
                name: "Gaming Laptop",
                price: 15990000,
                categoryId: categoryMap["Electronics"],
                description: "Powerful laptop for gaming and work",
                image: "https://picsum.photos/seed/laptop/400/300",
                stock: 20,
                isCart: false,
            },
            {
                id: uuidv4(),
                name: "Leather Jacket",
                price: 1200000,
                categoryId: categoryMap["Fashion"],
                description: "Premium leather jacket for all seasons",
                image: "https://picsum.photos/seed/jacket/400/300",
                stock: 25,
                isCart: false,
            },
            {
                id: uuidv4(),
                name: "Casual Sneakers",
                price: 750000,
                categoryId: categoryMap["Fashion"],
                description: "Comfortable everyday shoes",
                image: "https://picsum.photos/seed/sneakers/400/300",
                stock: 40,
                isCart: false,
            },
            {
                id: uuidv4(),
                name: "Denim Jeans",
                price: 550000,
                categoryId: categoryMap["Fashion"],
                description: "Classic blue jeans",
                image: "https://picsum.photos/seed/jeans/400/300",
                stock: 35,
                isCart: false,
            },
            {
                id: uuidv4(),
                name: "Wool Scarf",
                price: 200000,
                categoryId: categoryMap["Fashion"],
                description: "Soft wool scarf for winter",
                image: "https://picsum.photos/seed/scarf/400/300",
                stock: 45,
                isCart: false,
            },
            {
                id: uuidv4(),
                name: "Summer Hat",
                price: 180000,
                categoryId: categoryMap["Fashion"],
                description: "Stylish wide-brim summer hat",
                image: "https://picsum.photos/seed/hat/400/300",
                stock: 30,
                isCart: false,
            },
        ].map((product) => ({
            ...product,
            createdAt: dateNow,
            updatedAt: dateNow,
        }));
        await queryInterface.bulkInsert("products", products, {});
    },
    down: async (queryInterface) => {
        await queryInterface.bulkDelete("products", {}, {});
    },
};
