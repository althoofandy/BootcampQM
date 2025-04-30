import { v4 as uuidv4 } from "uuid";
export async function up(queryInterface) {
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
export async function down(queryInterface) {
    await queryInterface.bulkDelete("users", {});
}
