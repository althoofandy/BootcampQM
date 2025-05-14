import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
class TryoutController {
    // Get all Tryouts with filters
    async getAll(req, res) {
        try {
            const tryouts = await db.TryoutSection.findAll({
                order: [["order", "ASC"]], // Order by order field ascending
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });
            res.json({
                status: "success",
                message: "Tryouts fetched successfully",
                data: tryouts,
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }
    async getBySearch(req, res) {
        try {
            const { active, title, tag } = req.query;
            const where = {};
            if (active !== undefined) {
                where.active = active === "true" ? 1 : 0;
            }
            if (title) {
                where.title = { [Op.like]: `%${title}%` };
            }
            if (tag) {
                where.tag = { [Op.like]: `%${tag}%` };
            }
            if (Object.keys(where).length === 0) {
                res.status(400).json({
                    status: "fail",
                    message: "Please provide at least one search parameter (e.g., active, title, or tag).",
                });
            }
            const tryouts = await db.TryoutSection.findAll({
                where,
                order: [["order", "ASC"]],
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });
            res.status(200).json({
                status: "success",
                message: "Tryouts fetched successfully",
                data: tryouts,
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: "Failed to fetch tryouts",
                error: error.message,
            });
        }
    }
    // Create a new Tryout
    async create(req, res) {
        try {
            const { title, description, order, data, active, code, tag } = req.body;
            // Validate required fields
            if (!title) {
                res.status(400).json({
                    status: "error",
                    message: "Title is required",
                });
                return;
            }
            const tryout = await db.TryoutSection.create({
                id: uuidv4(),
                title,
                code,
                tag,
                description: description || null,
                order: order || null,
                data: data || null,
                active: active !== undefined ? active : 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const existingCourse = await db.TryoutSection.findOne({
                where: { code },
            });
            if (existingCourse) {
                res.status(400).json({
                    status: "error",
                    message: "Tryout with this code already exists",
                });
                return;
            }
            res.status(200).json({
                status: "success",
                message: "Tryout created successfully",
                data: tryout,
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }
    // Update Tryout
    async update(req, res) {
        try {
            const { id } = req.params;
            const { title, description, order, data, active, tag, code } = req.body;
            const tryout = await db.TryoutSection.findByPk(id);
            if (!tryout) {
                res.status(404).json({
                    status: "error",
                    message: "Tryout not found",
                });
                return;
            }
            // Update tryout fields
            await tryout.update({
                title: title || tryout.title,
                description: description !== undefined ? description : tryout.description,
                order: order !== undefined ? order : tryout.order,
                data: data !== undefined ? data : tryout.data,
                active: active !== undefined ? active : tryout.active,
                updatedAt: new Date(),
                tag: tag !== undefined ? data : tryout.tag,
                code: code !== undefined ? data : tryout.code,
            });
            res.json({
                status: "success",
                message: "Tryout updated successfully",
                data: tryout,
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    }
    // Delete Tryout
    async delete(req, res) {
        try {
            const { id } = req.params;
            const tryout = await db.TryoutSection.findByPk(id);
            if (!tryout) {
                res.status(404).json({
                    status: "error",
                    message: "Tryout not found",
                });
                return;
            }
            await tryout.destroy();
            res.json({
                status: "success",
                message: "Tryout deleted successfully",
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    }
}
export default new TryoutController();
