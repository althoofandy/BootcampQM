import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
class GroupController {
    // Get all groups with filters
    async getAll(req, res) {
        try {
            const groups = await db.Group.findAll({
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });
            res.json({
                status: "success",
                message: "Groups fetched successfully",
                data: groups,
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
            const { active, title, tag, parentId } = req.query;
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
            if (parentId) {
                where.parentId = parentId === "null" ? null : parentId;
            }
            if (Object.keys(where).length === 0) {
                res.status(400).json({
                    status: "fail",
                    message: "Please provide at least one search parameter (e.g., active, title, or tag).",
                });
            }
            const groups = await db.Group.findAll({
                where,
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });
            res.status(200).json({
                status: "success",
                message: "Grooups fetched successfully",
                data: groups,
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }
    // Create new group
    async create(req, res) {
        try {
            const { code, title, parentId, data, tag, active } = req.body;
            if (!code || !title) {
                res.status(400).json({
                    status: "error",
                    message: "Code and title are required",
                });
                return;
            }
            const existingGroup = await db.Group.findOne({ where: { code } });
            if (existingGroup) {
                res.status(400).json({
                    status: "error",
                    message: "Group with this code already exists",
                });
                return;
            }
            const group = await db.Group.create({
                id: uuidv4(),
                code,
                title,
                parentId: parentId || null,
                data: data || null,
                tag: tag || null,
                active: active !== undefined ? active : 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            res.json({
                status: "success",
                message: "Group created successfully",
                data: group,
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    }
    // Update group
    async update(req, res) {
        try {
            const { id } = req.params;
            const { code, title, parentId, data, tag, active } = req.body;
            const group = await db.Group.findByPk(id);
            if (!group) {
                res.status(404).json({
                    status: "error",
                    message: "Group not found",
                });
                return;
            }
            if (code && code !== group.code) {
                const existingGroup = await db.Group.findOne({ where: { code } });
                if (existingGroup) {
                    res.status(400).json({
                        status: "error",
                        message: "Another group with this code already exists",
                    });
                    return;
                }
            }
            await group.update({
                code: code || group.code,
                title: title || group.title,
                parentId: parentId !== undefined ? parentId : group.parentId,
                data: data !== undefined ? data : group.data,
                tag: tag !== undefined ? tag : group.tag,
                active: active !== undefined ? active : group.active,
                updatedAt: new Date(),
            });
            res.json({
                status: "success",
                message: "Group updated successfully",
                data: group,
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    }
    // Delete group
    async delete(req, res) {
        try {
            const { id } = req.params;
            const group = await db.Group.findByPk(id);
            if (!group) {
                res.status(404).json({
                    status: "error",
                    message: "Group not found",
                });
                return;
            }
            // Check if group has children
            const childCount = await db.Group.count({ where: { parentId: id } });
            if (childCount > 0) {
                res.status(400).json({
                    status: "error",
                    message: "Cannot delete group with existing child groups",
                });
                return;
            }
            await group.destroy();
            res.json({
                status: "success",
                message: "Group deleted successfully",
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
export default new GroupController();
