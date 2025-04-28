"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserDetail = exports.getUsers = void 0;
const users_data_1 = require("../data/users.data");
// Simulasi mutable data
let data = [...users_data_1.usersData];
const getUsers = (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Users data fetched successfully",
        data,
    });
};
exports.getUsers = getUsers;
const getUserDetail = (req, res) => {
    const { id } = req.params;
    const userId = Number(id);
    const user = data.find((u) => u.id === userId);
    if (user) {
        res.status(200).json({
            status: "success",
            message: "User detail fetched",
            data: user,
        });
    }
    else {
        res.status(404).json({
            status: "fail",
            message: "User not found",
        });
    }
};
exports.getUserDetail = getUserDetail;
const updateUser = (req, res) => {
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
    data[index] = Object.assign(Object.assign({}, data[index]), updatedInfo);
    return res.status(200).json({
        // <-- DI RETURN!
        status: "success",
        message: "User updated successfully",
        data: data[index],
    });
};
exports.updateUser = updateUser;
const deleteUser = (req, res) => {
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
exports.deleteUser = deleteUser;
