// scan-user.js
import { GoogleSheetService } from "../google-sheet.js";
import { sequelizeInstance, SHEET_ID } from "../shared.sequelize.js";

async function scanCourse() {
  const googleSheetService = new GoogleSheetService(
    "1QVu11Vs61Yzu16TU8nraCE4FB1Jc5-ksrNGH8QDFxMA",
    sequelizeInstance
  );
  await googleSheetService.initialize();
  await googleSheetService.massInsert("group");
}

scanCourse().catch(console.error);
