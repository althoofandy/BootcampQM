// controllers/user.controllers.ts
import { Request, Response } from "express";
import { usersData } from "../data/users.data";

// Simulasi mutable data
let data = [...usersData];

export const getUsers = (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Users data fetched successfully",
    data,
  });
};

export const getUserDetail = (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = Number(id);
  const user = data.find((u) => u.id === userId);

  if (user) {
    res.status(200).json({
      status: "success",
      message: "User detail fetched",
      data: user,
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
};

export const updateUser: (req: Request, res: Response) => void = (req, res) => {
  const { id } = req.params;
  const updatedInfo = req.body;
  const userId = Number(id);

  const index = data.findIndex((u) => u.id === userId);

  if (index === -1) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  data[index] = { ...data[index], ...updatedInfo };

  return res.status(200).json({
    // <-- DI RETURN!
    status: "success",
    message: "User updated successfully",
    data: data[index],
  });
};

export const deleteUser: (req: Request, res: Response) => void = (req, res) => {
  const { id } = req.params;
  const userId = Number(id);

  const index = data.findIndex((u) => u.id === userId);

  if (index === -1) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  const deletedUser = data.splice(index, 1);

  return res.status(200).json({
    // <-- DI RETURN juga di sini
    status: "success",
    message: "User deleted successfully",
    data: deletedUser[0],
  });
};
