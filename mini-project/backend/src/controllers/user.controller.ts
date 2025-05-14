import { Request, Response } from "express";
import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

class UserController {
  // Get all users with optional filters
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await db.User.findAll({
        include: [
          {
            model: db.Profile,
            as: "profile",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      });

      res.status(200).json({
        status: "success",
        message: "Users fetched successfully",
        data: users,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Failed to fetch users",
        error: "Internal Server Error",
      });
    }
  }

  async getBySearch(req: Request, res: Response): Promise<void> {
    try {
      const { fullname, username, email, active, id } = req.query;

      const where: any = {};

      if (fullname) {
        where.fullname = { [Op.like]: `%${fullname}%` };
      }

      if (username) {
        where.username = { [Op.like]: `%${username}%` };
      }

      if (email) {
        where.email = { [Op.like]: `%${email}%` };
      }

      if (active !== undefined) {
        where.active = active === "true";
      }

      if (id) {
        where.id = { [Op.like]: `%${id}%` };
      }

      // Jika tidak ada filter sama sekali, kembalikan error
      if (Object.keys(where).length === 0) {
        res.status(400).json({
          status: "fail",
          message: "At least one search parameter is required.",
        });
        return;
      }

      const users = await db.User.findAll({
        where,
        include: [
          {
            model: db.Profile,
            as: "profile",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      });

      res.status(200).json({
        status: "success",
        message: "Users fetched successfully",
        data: users,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Failed to fetch users",
        error: error.message,
      });
    }
  }

  // Get user by ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await db.User.findByPk(req.params.id, {
        include: [
          {
            model: db.Profile,
            as: "profile",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      });

      if (!user) {
        res.status(404).json({
          status: "error",
          message: "User not found",
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "User fetched successfully",
        data: user,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Create new user
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, fullname, username, phoneNumber, profile } =
        req.body;

      // Validate required fields
      if (!email || !password || !fullname) {
        res.status(400).json({
          status: "error",
          message: "Email, password, and fullname are required",
        });
        return;
      }

      // Check if email already exists
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        res.status(404).json({
          status: "error",
          message: "Email already in use",
        });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user transaction
      const result = await db.sequelize.transaction(async (t) => {
        const user = await db.User.create(
          {
            id: uuidv4(),
            email,
            username,
            phoneNumber,
            password: hashedPassword,
            fullname,
            isActive: true,
          },
          { transaction: t }
        );

        await db.Profile.create(
          {
            userId: user.id,
            bio: profile?.bio || "",
            address: profile?.address || "",
            gender: profile?.gender || "other",
          },
          { transaction: t }
        );

        return user;
      });

      const userData = await db.User.findByPk(result.id, {
        include: [
          {
            model: db.Profile,
            as: "profile",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      });

      res.json({
        status: "success",
        message: "User created successfully",
        data: userData,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Update user
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { email, password, fullname, isActive, profile } = req.body;

      const user = await db.User.findByPk(id, {
        include: [
          {
            model: db.Profile,
            as: "profile",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      });

      if (!user) {
        res.status(404).json({
          status: "error",
          message: "User not found",
        });
        return;
      }

      // Check if email is being updated and already exists
      if (email && email !== user.email) {
        const emailExists = await db.User.findOne({ where: { email } });
        if (emailExists) {
          res.status(409).json({
            status: "error",
            message: "Email already in use",
          });
          return;
        }
      }

      // Update user transaction
      await db.sequelize.transaction(async (t) => {
        const updateData: any = {
          email: email || user.email,
          fullname: fullname || user.fullname,
          isActive: isActive !== undefined ? isActive : user.isActive,
        };

        if (password) {
          updateData.password = await bcrypt.hash(password, 10);
        }

        await user.update(updateData, { transaction: t });

        if (profile && user.profile) {
          await user.profile.update(profile, { transaction: t });
        }
      });

      const updatedUser = await db.User.findByPk(id, {
        include: [
          {
            model: db.Profile,
            as: "profile",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      });

      res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  // Delete user
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await db.User.findByPk(id);
      if (!user) {
        res.status(404).json({
          status: "error",
          message: "User not found",
        });
        return;
      }

      await db.sequelize.transaction(async (t) => {
        // Delete profile first to maintain referential integrity
        await db.Profile.destroy({ where: { userId: id }, transaction: t });
        await user.destroy({ transaction: t });
      });

      res.status(200).json({
        status: "success",
        message: "User deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Failed to delete user",
        error: error.message,
      });
    }
  }
}

export default new UserController();
