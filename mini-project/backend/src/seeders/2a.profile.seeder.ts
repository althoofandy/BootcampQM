// seeders/YYYYMMDDHHMMSS-seed-profiles.ts
import { QueryInterface } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface: QueryInterface) {
  const now = new Date();

  // Ambil ID user yang sudah ada di tabel 'users'
  const users = await queryInterface.sequelize.query(
    `SELECT id, username FROM users`
  );

  const userMap: { [key: string]: string } = {};
  users[0].forEach((user: any) => {
    userMap[user.username] = user.id;
  });

  await queryInterface.bulkInsert("profiles", [
    {
      id: uuidv4(),
      userId: userMap["FastTiger-N4c3W"], // ID user pertama
      bio: "Pengguna pertama di platform ini.",
      gender: "Laki-laki",
      address: "Jl. Merdeka No.1, Jakarta",
      active: 1,
      data: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      userId: userMap["sargeant"],
      bio: "Saya seorang musisi dan penggemar reggae.",
      gender: "Laki-laki",
      address: "Jl. Raya No.2, Bali",
      active: 1,
      data: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      userId: userMap["sysadmin"],
      bio: "Admin platform yang siap membantu Anda.",
      gender: "Laki-laki",
      address: "Jl. Admin No.3, Surabaya",
      active: 1,
      data: null,
      createdAt: now,
      updatedAt: now,
    },
  ]);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete("profiles", {});
}
