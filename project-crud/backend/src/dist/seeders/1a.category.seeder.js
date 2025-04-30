import { v4 as uuidv4 } from "uuid";
export default {
    up: async (queryInterface) => {
        const dateNow = new Date();
        const categories = [
            {
                categoryId: uuidv4(),
                name: "Electronics",
                createdAt: dateNow,
                updatedAt: dateNow,
            },
            {
                categoryId: uuidv4(),
                name: "Fashion",
                createdAt: dateNow,
                updatedAt: dateNow,
            },
            {
                categoryId: uuidv4(),
                name: "Books",
                createdAt: dateNow,
                updatedAt: dateNow,
            },
        ];
        await queryInterface.bulkInsert("categories", categories, {});
    },
    down: async (queryInterface) => {
        await queryInterface.bulkDelete("categories", {}, {});
    },
};
