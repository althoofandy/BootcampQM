import { Sequelize } from "sequelize";
import { GoogleSheetService } from "./google-sheet.js";
import dotenv from "dotenv";
dotenv.config();
async function test() {
    const sequelizeInstance = new Sequelize({
        dialect: "mysql",
        host: "localhost",
        username: "root",
        password: "",
        database: "mini_project_db",
    });
    const googleSheetService = new GoogleSheetService("1WinYaT6IojcKB9VRhaqTIUSa1vfcf6By41X3ObpsTxk", sequelizeInstance);
    await googleSheetService.initialize();
    // Push data from MySQL to Google Sheets
    // await googleSheetService.pushDataToSheet("user");
    //   await googleSheetService.pushDataToSheet("course");
    //   await googleSheetService.pushDataToSheet("tryout_section");
    //   await googleSheetService.pushDataToSheet("group");
    // Push data from Google Sheets to MySQL
    // await googleSheetService.syncDataToMySQL("user");
    //   await googleSheetService.pushDataToMySQL("course");
    //   await googleSheetService.pushDataToMySQL("tryout_section");
    //   await googleSheetService.pushDataToMySQL("group");
}
test().catch(console.error);
