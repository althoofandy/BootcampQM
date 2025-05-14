// shared-sequelize.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
export const sequelizeInstance = new Sequelize({
    dialect: "mysql",
    host: "localhost",
    username: "root",
    password: "",
    database: "mini_project_db",
});
export const SHEET_ID = "1WinYaT6IojcKB9VRhaqTIUSa1vfcf6By41X3ObpsTxk";
export default {
    sequelizeInstance,
    SHEET_ID,
};
