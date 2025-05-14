// scan-user.js
import { GoogleSheetService } from "../google-sheet.js";
import { sequelizeInstance, SHEET_ID } from "../shared.sequelize.js";

async function scanCourse() {
  const googleSheetService = new GoogleSheetService(
    "1sLX5LDargeePThggMlyAHhzLSJV-o-4sIC43oGcvNSA",
    sequelizeInstance
  );
  await googleSheetService.initialize();
  await googleSheetService.massDelete("tryout_section");
}

scanCourse().catch(console.error);
