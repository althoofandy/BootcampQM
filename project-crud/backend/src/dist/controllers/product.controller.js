import AbstractModel from "../abstracts/model.abstract.js";
import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
class ProductController extends AbstractModel {
    constructor() {
        super();
    }
    async getAll(req, res) {
        try {
            const products = await db.Product.findAll({
                include: [
                    {
                        model: db.Category,
                        as: "category",
                        attributes: ["name"],
                    },
                ],
            });
            res.json({
                status: "success",
                message: "Products fetched successfully",
                products,
            });
        }
        catch (error) {
            res.json({
                status: "error",
                message: error.message,
            });
        }
    }
    async getById(req, res) {
        try {
            const product = await db.Product.findByPk(req.params.id);
            if (!product) {
                res.json({
                    message: "Product not found",
                    status: "error",
                });
                return;
            }
            res.json({
                status: "success",
                message: "Product fetched successfully",
                product,
            });
        }
        catch (error) {
            res.json({
                status: "error",
                message: error.message,
            });
        }
    }
    async create(req, res) {
        try {
            const product = { ...req.body, id: uuidv4() };
            await db.Product.create(product);
            res.json({
                status: "success",
                message: "User created successfully",
                data: product,
            });
        }
        catch (error) {
            console.log(error);
            res.json({
                status: "error",
                message: error.message,
            });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, price } = req.body;
            const product = await db.Product.update({ ...req.body }, { where: { id } });
            if (!product) {
                res.json({
                    status: "error",
                    message: "Product not found",
                });
                return;
            }
            product.name = name;
            product.price = price;
            res.json({
                status: "success",
                message: "User updated successfully",
                data: product,
            });
        }
        catch (error) {
            res.json({
                status: "error",
                message: error.message,
            });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            await db.Product.destroy({
                where: {
                    id,
                },
            });
            res.json({
                status: "success",
                message: "User deleted successfully",
                data: id,
            });
        }
        catch (error) {
            res.json({
                status: "error",
                message: error.message,
            });
        }
    }
}
export default new ProductController();
