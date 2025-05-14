import { v4 as uuidv4 } from "uuid";
export async function up(queryInterface) {
    const now = new Date();
    const rootGroupId = uuidv4();
    const subGroupId1 = uuidv4();
    await queryInterface.bulkInsert("group", [
        {
            id: rootGroupId,
            parentId: null,
            code: "PHINTRACO_GROUP",
            title: "Phintraco Group",
            data: '{"icon": "\u{1F3E2}", "type": "group"}',
            tag: "phintraco_group",
            active: 1,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: subGroupId1,
            parentId: rootGroupId,
            code: "PHINCON",
            title: "Phincon",
            data: '{"icon": "\u{1F3E2}", "type": "group"}',
            tag: "phincon",
            active: 1,
            createdAt: now,
            updatedAt: now,
        },
    ]);
}
export async function down(queryInterface) {
    await queryInterface.bulkDelete("group", {
        code: ["PHINTRACO_GROUP", "PHINCON"],
    });
}
