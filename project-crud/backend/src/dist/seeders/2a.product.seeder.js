import { v4 as uuidv4 } from "uuid";
export default {
    async up(queryInterface) {
        const dateNow = new Date();
        const categories = await queryInterface.sequelize.query("SELECT categoryId, name FROM categories;");
        const categoryMap = {};
        categories[0].forEach((category) => {
            categoryMap[category.name] = category.categoryId;
        });
        const products = [
            {
                id: uuidv4(),
                name: "Smartphone X",
                price: 7990000,
                categoryId: categoryMap["Electronics"],
                description: "Flagship phone with awesome camera",
                image: "https://example.com/images/smartphone.jpg",
                stock: 50,
                isCart: false,
            },
            {
                id: uuidv4(),
                name: "Smartwatch Y",
                price: 2500000,
                categoryId: categoryMap["Electronics"],
                description: "Smartwatch with fitness tracking",
                image: "https://example.com/images/smartwatch.jpg",
                stock: 30,
                isCart: false,
            },
            {
                id: uuidv4(),
                name: "Bluetooth Headphones",
                price: 1500000,
                categoryId: categoryMap["Electronics"],
                description: "Noise-cancelling over-ear headphones",
                image: "https://example.com/images/headphones.jpg",
                stock: 60,
                isCart: false,
            },
            {
                id: uuidv4(),
                name: "4K LED TV",
                price: 8990000,
                categoryId: categoryMap["Electronics"],
                description: "Ultra HD Smart TV 55 inch",
                image: "https://example.com/images/tv.jpg",
                stock: 15,
                isCart: false,
            },
            {
                id: uuidv4(),
                name: "Gaming Laptop",
                price: 15990000,
                categoryId: categoryMap["Electronics"],
                description: "Powerful laptop for gaming and work",
                image: "https://example.com/images/laptop.jpg",
                stock: 20,
                isCart: false,
            },
            {
                id: uuidv4(),
                name: "Leather Jacket",
                price: 1200000,
                categoryId: categoryMap["Fashion"],
                description: "Premium leather jacket for all seasons",
                image: "https://example.com/images/jacket.jpg",
                stock: 25,
                isCart: false,
            },
            {
                id: uuidv4(),
                name: "Casual Sneakers",
                price: 750000,
                categoryId: categoryMap["Fashion"],
                description: "Comfortable everyday shoes",
                image: "https://example.com/images/sneakers.jpg",
                stock: 40,
                isCart: false,
            },
            {
                id: uuidv4(),
                name: "Denim Jeans",
                price: 550000,
                categoryId: categoryMap["Fashion"],
                description: "Classic blue jeans",
                image: "https://example.com/images/jeans.jpg",
                stock: 35,
                isCart: false,
            },
            {
                id: uuidv4(),
                name: "Wool Scarf",
                price: 200000,
                categoryId: categoryMap["Fashion"],
                description: "Soft wool scarf for winter",
                image: "https://example.com/images/scarf.jpg",
                stock: 45,
                isCart: false,
            },
            {
                id: uuidv4(),
                name: "Summer Hat",
                price: 180000,
                categoryId: categoryMap["Fashion"],
                description: "Stylish wide-brim summer hat",
                image: "https://example.com/images/hat.jpg",
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
