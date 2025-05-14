import { v4 as uuidv4 } from "uuid";
export default {
    up: async (queryInterface) => {
        const dateNow = new Date();
        // 1. Get transactions
        const [transactions] = await queryInterface.sequelize.query(`SELECT id FROM transactions ORDER BY "createdAt" DESC LIMIT 2;`);
        if (!transactions || transactions.length < 2) {
            throw new Error("Need at least 2 transactions in database");
        }
        // 2. Get available products
        const [products] = await queryInterface.sequelize.query(`SELECT id, name, price FROM products WHERE stock > 0 LIMIT 3;`);
        if (!products || products.length < 3) {
            throw new Error("Need at least 3 available products");
        }
        // 3. Create transaction details with products array
        const transactionDetails = [
            {
                id: uuidv4(),
                transactionId: transactions[0].id,
                products: JSON.stringify([
                    // Array of products as JSON
                    {
                        productId: products[0].id,
                        name: products[0].name,
                        quantity: 2,
                        price: products[0].price,
                    },
                    {
                        productId: products[1].id,
                        name: products[1].name,
                        quantity: 1,
                        price: products[1].price,
                    },
                ]),
                createdAt: dateNow,
                updatedAt: dateNow,
            },
            {
                id: uuidv4(),
                transactionId: transactions[1].id,
                products: JSON.stringify([
                    {
                        productId: products[2].id,
                        name: products[2].name,
                        quantity: 3,
                        price: products[2].price,
                    },
                ]),
                createdAt: dateNow,
                updatedAt: dateNow,
            },
        ];
        await queryInterface.bulkInsert("transaction_details", transactionDetails);
    },
    down: async (queryInterface) => {
        await queryInterface.bulkDelete("transaction_details", {});
    },
};
