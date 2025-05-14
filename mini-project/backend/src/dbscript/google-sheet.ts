import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import dotenv from "dotenv";
import db from "../models/index.js";
import { Sequelize, Transaction } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

dotenv.config();

type SheetName = "users" | "course" | "tryout_section" | "group";
type ModelMap = {
  users: typeof db.User;
  course: typeof db.Course;
  tryout_section: typeof db.TryoutSection;
  group: typeof db.Group;
};

export class GoogleSheetService {
  private readonly sheetId: string;
  private doc!: GoogleSpreadsheet;
  private sequelize: Sequelize;
  private initialized: boolean = false;

  constructor(sheetId: string, sequelizeInstance: Sequelize) {
    this.sheetId = sheetId;
    this.sequelize = sequelizeInstance;
  }

  // ==================== INITIALIZATION ====================
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.initGoogleSheets();
      await this.ensureSheetsExist([
        "users",
        "course",
        "tryout_section",
        "group",
      ]);
      this.initialized = true;
    } catch (error) {
      throw new Error(
        `Initialization failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  private async initGoogleSheets(): Promise<void> {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.doc = new GoogleSpreadsheet(this.sheetId, serviceAccountAuth);
    await this.doc.loadInfo();
  }

  private async ensureSheetsExist(requiredSheets: SheetName[]): Promise<void> {
    for (const sheetName of requiredSheets) {
      if (!this.doc.sheetsByTitle[sheetName]) {
        await this.doc.addSheet({ title: sheetName });
      }
    }
  }

  // ==================== CRUD OPERATIONS ====================
  async getAllFromTable(tableName: SheetName): Promise<any[]> {
    await this.initialize();
    const model = this.getModel(tableName) as any;
    const records = await model.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    return records.map((record: { toJSON: () => any }) => record.toJSON());
  }

  async pushDataToSheet(tableName: SheetName): Promise<void> {
    await this.initialize();

    // 1. Ambil data dari database
    const data = await this.getAllFromTable(tableName);
    if (data.length === 0) {
      console.log(`No data found for table ${tableName}`);
      return;
    }

    // 2. Dapatkan sheet yang sesuai
    const sheet = this.doc.sheetsByTitle[tableName];
    if (!sheet) {
      throw new Error(`Sheet "${tableName}" not found`);
    }

    // 3. Bersihkan sheet yang ada (optional)
    await sheet.clear();

    // 4. Set header row (kolom)
    let headers = Object.keys(data[0]);
    if (tableName === "users") {
      headers = headers.filter((header) => header !== "password");
    }
    if (tableName !== "group") {
      headers = headers.filter((header) => header !== "id");
    }
    await sheet.setHeaderRow(headers);

    // 5. Tambahkan data ke sheet
    const filteredData = data.map((row) => {
      const newRow = { ...row };
      if (tableName === "users") {
        delete newRow.password;
      }
      if (tableName !== "group") {
        delete newRow.id;
      }
      return newRow;
    });

    await sheet.addRows(filteredData);
    console.log(`Exported ${filteredData.length} rows to sheet "${tableName}"`);
  }

  async massInsert(tableName: SheetName): Promise<number> {
    await this.initialize();
    const rows = await this.getSheetData(tableName);
    if (rows.length === 0) return 0;

    const model = this.getModel(tableName) as any;
    const transformedData = await this.transformData(tableName, rows);
    const identifierField = this.getIdentifierField(tableName);

    return this.sequelize.transaction(async (transaction: Transaction) => {
      let insertedCount = 0;

      for (const data of transformedData) {
        const identifierValue = data[identifierField];

        const existing = await model.findOne({
          where: { [identifierField]: identifierValue },
          transaction,
        });

        if (!existing) {
          await model.create(data, { transaction });
          insertedCount++;
        } else {
          console.warn(
            `Duplicate found for ${identifierField}: ${identifierValue} - Skipping insert`
          );
        }
      }

      return insertedCount;
    });
  }

  async massUpdate(
    tableName: SheetName
  ): Promise<{ updated: number; created: number }> {
    await this.initialize();
    const rows = await this.getSheetData(tableName);
    if (rows.length === 0) return { updated: 0, created: 0 };

    const model = this.getModel(tableName);
    const transformedData = await this.transformData(tableName, rows);
    const identifierField = this.getIdentifierField(tableName);

    return this.sequelize.transaction(async (transaction: Transaction) => {
      let updatedCount = 0;
      let createdCount = 0;

      for (const data of transformedData) {
        const identifierValue = data[identifierField];

        const existing = await model.findOne({
          where: { [identifierField]: identifierValue },
          transaction,
        });

        if (existing) {
          const [count] = await model.update(data, {
            where: { [identifierField]: identifierValue },
            transaction,
          });
          updatedCount += count;
        } else {
          if (tableName !== "users") {
            data.id = uuidv4();
          }
          await model.create(data, { transaction });
          createdCount++;
        }
      }

      return { updated: updatedCount, created: createdCount };
    });
  }

  async massDelete(tableName: SheetName): Promise<number> {
    await this.initialize();
    const rows = await this.getSheetData(tableName);
    if (rows.length === 0) return 0;

    const model = this.getModel(tableName) as any;
    const identifierField = this.getIdentifierField(tableName);
    const identifiers = rows.map((row) => row[identifierField]);

    const deletedCount = await model.destroy({
      where: { [identifierField]: identifiers },
    });

    return deletedCount;
  }

  // ==================== HELPER METHODS ====================
  private getModel<T extends SheetName>(tableName: T): ModelMap[T] {
    const modelMap: ModelMap = {
      users: db.User,
      course: db.Course,
      tryout_section: db.TryoutSection,
      group: db.Group,
    };

    if (!modelMap[tableName]) {
      throw new Error(`Model for table "${tableName}" not found`);
    }

    return modelMap[tableName];
  }

  private getIdentifierField(tableName: SheetName): string {
    const identifierMap: Record<SheetName, string> = {
      users: "username",
      course: "code",
      tryout_section: "code",
      group: "code",
    };

    return identifierMap[tableName];
  }

  private async getSheetData(
    sheetName: SheetName
  ): Promise<Record<string, any>[]> {
    const sheet = this.doc.sheetsByTitle[sheetName];
    if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);

    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();
    return rows.map((row) => row.toObject());
  }

  private async transformData(
    tableName: SheetName,
    data: any[]
  ): Promise<any[]> {
    const transformers: Record<SheetName, (row: any) => Promise<any>> = {
      users: async (row) => ({
        username: row.username,
        email: row.email.toLowerCase().trim(),
        fullname: row.fullname,
        password: await bcrypt.hash(row.password, 10),
        phoneNumber: row.phoneNumber,
        active: row.active !== undefined ? Boolean(row.active) : true,
        data: this.parseJsonField(row.data),
        createdAt: row.createdAt || new Date(),
        updatedAt: new Date(),
      }),

      course: async (row) => ({
        code: row.code,
        order: row.order,
        tag: row.tag,
        description: row.description,
        title: row.title,
        active: row.active === "1" || row.active === true,
        data: this.parseJsonField(row.data),
        createdAt: row.createdAt || new Date(),
        updatedAt: new Date(),
      }),

      tryout_section: async (row) => ({
        code: row.code,
        order: row.order,
        tag: row.tag,
        description: row.description,
        title: row.title,
        active: row.active === "1" || row.active === true,
        data: this.parseJsonField(row.data),
        createdAt: row.createdAt || new Date(),
        updatedAt: new Date(),
      }),

      group: async (row) => ({
        id: uuidv4(),
        code: row.code,
        title: row.title,
        tag: row.tag,
        active: row.active === "1" || row.active === true,
        data: this.parseJsonField(row.data),
        createdAt: row.createdAt || new Date(),
        updatedAt: new Date(),
      }),
    };

    return Promise.all(data.map((row) => transformers[tableName](row)));
  }

  private parseJsonField(data: any): object | null {
    if (!data || data === "") return null;
    if (typeof data === "object") return data;

    try {
      return JSON.parse(data);
    } catch {
      console.warn(`Invalid JSON data: ${data}`);
      return null;
    }
  }
}
