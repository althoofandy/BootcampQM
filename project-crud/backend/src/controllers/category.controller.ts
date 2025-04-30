import { Request, Response } from "express";
import AbstractModel from "../abstracts/model.abstract.js";
import db from "../models/index.js";

class CategoryController extends AbstractModel {
  create(req: Request, res: Response): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update(req: Request, res: Response): Promise<any> {
    throw new Error("Method not implemented.");
  }
  delete(req: Request, res: Response): Promise<any> {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
  }
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const categories = await db.Category.findAll({
        attributes: ["id", "name"],
        include: [
          {
            model: db.Product,
            attributes: ["id", "name", "price", "stock"],
            as: "products",
          },
        ],
      });
      console.log(categories);
      res.json({
        status: "success",
        message: "Categories fetched successfully",
        data: categories,
      });
    } catch (error: any) {
      res.json({
        status: "error",
        message: error.message,
      });
    }
  }
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const category = await db.Category.findByPk(req.params.id);
      if (!category) {
        res.json({
          message: "Category not found",
          status: "error",
        });
        return;
      }
      res.json({
        status: "success",
        message: "Category fetched successfully",
        category,
      });
    } catch (error: any) {
      res.json({
        status: "error",
        message: error.message,
      });
    }
  }
}

export default new CategoryController();
