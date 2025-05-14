import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
class CourseController {
    // Get all Courses
    async getAll(req, res) {
        try {
            const courses = await db.Course.findAll({
                order: [["order", "ASC"]], // Order by order field ascending
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });
            res.json({
                status: "success",
                message: "Courses fetched successfully",
                data: courses,
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: "Ïnternal Server Error",
            });
        }
    }
    // Get Course by ID
    async getBySearch(req, res) {
        try {
            const { active, tag, title, code } = req.query;
            const where = {};
            if (active !== undefined) {
                where.active = active === "true" ? 1 : 0;
            }
            if (tag) {
                where.tag = tag;
            }
            if (title) {
                where.title = { [Op.like]: `%${title}%` };
            }
            if (code) {
                where.code = { [Op.like]: `%${code}%` };
            }
            if (Object.keys(where).length === 0) {
                res.status(400).json({
                    status: "fail",
                    message: "At least one search parameter is required.",
                });
                return;
            }
            const course = await db.Course.findAll({
                where,
                order: [["order", "ASC"]],
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });
            if (!course) {
                res.status(404).json({
                    status: "error",
                    message: "Course not found",
                });
                return;
            }
            res.json({
                status: "success",
                message: "Course fetched successfully",
                data: course,
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    }
    // Create a new Course
    async create(req, res) {
        try {
            const { code, title, description, order, data, tag, active } = req.body;
            // Validate required fields
            if (!code || !title) {
                res.status(400).json({
                    status: "error",
                    message: "Code and title are required",
                });
                return;
            }
            // Check if code already exists
            const existingCourse = await db.Course.findOne({ where: { code } });
            if (existingCourse) {
                res.status(404).json({
                    status: "error",
                    message: "Course with this code already exists",
                });
                return;
            }
            const course = await db.Course.create({
                id: uuidv4(),
                code,
                title,
                description: description || null,
                order: order || null,
                data: data || null,
                tag: tag || null,
                active: active !== undefined ? active : 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            res.json({
                status: "success",
                message: "Course created successfully",
                data: course,
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    }
    // Update Course
    async update(req, res) {
        try {
            const { id } = req.params;
            const { code, title, description, order, data, tag, active } = req.body;
            const course = await db.Course.findByPk(id);
            if (!course) {
                res.status(404).json({
                    status: "error",
                    message: "Course not found",
                });
                return;
            }
            // Check if new code already exists (if code is being updated)
            if (code && code !== course.code) {
                const existingCourse = await db.Course.findOne({ where: { code } });
                if (existingCourse) {
                    res.status(400).json({
                        status: "error",
                        message: "Another course with this code already exists",
                    });
                    return;
                }
            }
            // Update course fields
            await course.update({
                code: code || course.code,
                title: title || course.title,
                description: description !== undefined ? description : course.description,
                order: order !== undefined ? order : course.order,
                data: data !== undefined ? data : course.data,
                tag: tag !== undefined ? tag : course.tag,
                active: active !== undefined ? active : course.active,
                updatedAt: new Date(),
            });
            res.json({
                status: "success",
                message: "Course updated successfully",
                data: course,
            });
        }
        catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    }
    // Delete Course
    async delete(req, res) {
        try {
            const { id } = req.params;
            const course = await db.Course.findByPk(id);
            if (!course) {
                res.status(404).json({
                    status: "error",
                    message: "Course not found",
                });
                return;
            }
            await course.destroy();
            res.json({
                status: "success",
                message: "Course deleted successfully",
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
export default new CourseController();
