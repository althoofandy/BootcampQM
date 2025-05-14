// scan-user.js
import { GoogleSheetService } from "../google-sheet.js";
import { sequelizeInstance, SHEET_ID } from "../shared.sequelize.js";

async function scanCourse() {
  const googleSheetService = new GoogleSheetService(
    SHEET_ID,
    sequelizeInstance
  );
  await googleSheetService.initialize();
  await googleSheetService.pushDataToSheet("course");
}

scanCourse().catch(console.error);
