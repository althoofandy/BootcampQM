import { v4 as uuidv4 } from "uuid";
export async function up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert("course", [
        {
            id: uuidv4(),
            code: "ISMS-S01_API_SECURITY",
            title: "API Security",
            description: null,
            order: 1,
            data: '{"icon": "\u26A0\uFE0F", "type": "LMS", "telegram": {"shortId": 1}}',
            tag: "phincon",
            active: 1,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: uuidv4(),
            code: "ISMS-S21_SECURE_SYSTEM_DEVELOPMENT_LIFECYCLE",
            title: "Secure System Development Lifecycle",
            description: null,
            order: 1,
            data: '{"icon": "\u26A0\uFE0F", "type": "LMS", "telegram": {"shortId": 2}}',
            tag: "phincon",
            active: 1,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: uuidv4(),
            code: "ISMS-S30_BUILD_SECURITY_SYSTEM_STANDARD",
            title: "Security System Standard",
            description: null,
            order: 1,
            data: '{"icon": "\u26A0\uFE0F", "type": "LMS", "telegram": {"shortId": 3}}',
            tag: "phincon",
            active: 1,
            createdAt: now,
            updatedAt: now,
        },
    ]);
}
export async function down(queryInterface) {
    await queryInterface.bulkDelete("course", {});
}
