// sync-user.js
import { GoogleSheetService } from "../google-sheet.js";
import { sequelizeInstance } from "../shared.sequelize.js";
async function syncUser() {
    const googleSheetService = new GoogleSheetService("1mc7dCqZ9GRYPXti34XEiIS-AnQf8-Nlin-jgUNQBAtU", sequelizeInstance);
    await googleSheetService.initialize();
    await googleSheetService.massUpdate("users");
}
syncUser().catch(console.error);
