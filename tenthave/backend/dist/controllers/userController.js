"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserApproval = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const index_1 = require("../index");
// GET /api/users - Get all users (Admin only)
const getUsers = async (req, res) => {
    try {
        const { role, isActive, limit, offset } = req.query;
        const where = {};
        // Filter by role
        if (role) {
            where.role = role;
        }
        // Filter by active status
        if (isActive !== undefined) {
            where.isActive = isActive === "true";
        }
        const users = await index_1.prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                isApproved: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: limit ? parseInt(limit) : undefined,
            skip: offset ? parseInt(offset) : undefined,
        });
        res.json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};
exports.getUsers = getUsers;
// GET /api/users/:id - Get a specific user (Admin only)
const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await index_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                isApproved: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
};
exports.getUser = getUser;
// PUT /api/users/:id - Update user (Admin only)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, isActive, isApproved } = req.body;
        // Check if user exists
        const existingUser = await index_1.prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }
        // Build update data
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (role !== undefined)
            updateData.role = role;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        if (isApproved !== undefined)
            updateData.isApproved = isApproved;
        const updatedUser = await index_1.prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                isApproved: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.json(updatedUser);
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
};
exports.updateUser = updateUser;
// DELETE /api/users/:id - Delete user (Admin only)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Prevent admin from deleting themselves
        if (req.user?.id === id) {
            return res.status(400).json({ error: "Cannot delete your own account" });
        }
        const user = await index_1.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await index_1.prisma.user.delete({
            where: { id },
        });
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
};
exports.deleteUser = deleteUser;
// PATCH /api/users/:id/approval - Update user approval status (Admin only)
const updateUserApproval = async (req, res) => {
    try {
        const { id } = req.params;
        const { isApproved } = req.body;
        if (typeof isApproved !== "boolean") {
            return res.status(400).json({ error: "isApproved must be a boolean" });
        }
        // Check if user exists
        const existingUser = await index_1.prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }
        const updatedUser = await index_1.prisma.user.update({
            where: { id },
            data: { isApproved },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                isApproved: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.json(updatedUser);
    }
    catch (error) {
        console.error("Error updating user approval:", error);
        res.status(500).json({ error: "Failed to update user approval" });
    }
};
exports.updateUserApproval = updateUserApproval;
//# sourceMappingURL=userController.js.map