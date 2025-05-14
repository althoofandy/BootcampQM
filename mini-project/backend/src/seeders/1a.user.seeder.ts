// seeders/YYYYMMDDHHMMSS-seed-users.ts
import { QueryInterface } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface: QueryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert("users", [
    {
      id: uuidv4(),
      fullname: "Sigit Sasongko",
      username: "FastTiger-N4c3W",
      email: "sigit.center31@gmail.com",
      phoneNumber: "+6286403152165",
      password: "$2b$10$ULAkbSgwEoNKhCdwyymq3O8ui6MGp0a7eGhWrwuWKLaBd2nbkcsU.",
      active: 1,
      data: "{}",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      fullname: "Sigit Sasongko",
      username: "sargeant",
      email: "siko.spade31@gmail.com",
      phoneNumber: "+6285725363777",
      password: "$2b$10$wTHh1i2PeOAiYZZ0Uzg9/ObHqj7cSWJPSBBE08plrBILaSEo2Ctri",
      active: 1,
      data: '{"telegram": {"id": "703181169", "exam": {"currentExamId": "6d8f33d8-fa85-4447-9532-f6d3a2aea36a", "currentQuestionIndex": 6}, "lastState": "start", "currentExamId": null, "currentQuestionIndex": null}}',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      fullname: "System Administrator",
      username: "sysadmin",
      email: "sysadmin@phindojo.id",
      phoneNumber: "+6281234567890",
      password: "$2b$10$hDNHnq80yyfxQuY66tPMHu7liT4WrxDY7iP8NLN1l9vEDDTIZbc/6",
      active: 1,
      data: '{"platforms": ["[\\"phindojo\\"]"]}',
      createdAt: now,
      updatedAt: now,
    },
  ]);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete("users", {});
}
