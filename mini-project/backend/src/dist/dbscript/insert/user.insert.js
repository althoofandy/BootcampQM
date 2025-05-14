// scan-user.js
import { GoogleSheetService } from "../google-sheet.js";
import { sequelizeInstance } from "../shared.sequelize.js";
async function scanCourse() {
    const googleSheetService = new GoogleSheetService("1QVu11Vs61Yzu16TU8nraCE4FB1Jc5-ksrNGH8QDFxMA", sequelizeInstance);
    await googleSheetService.initialize();
    await googleSheetService.massInsert("users");
}
scanCourse().catch(console.error);
