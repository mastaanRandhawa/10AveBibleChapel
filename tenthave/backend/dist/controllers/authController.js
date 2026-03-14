"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCurrentUser = exports.getCurrentUser = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
// Generate JWT token
const generateToken = (userId, email, role, isApproved) => {
    const secret = process.env.JWT_SECRET || "your-secret-key";
    return jsonwebtoken_1.default.sign({ id: userId, email, role, isApproved }, secret, { expiresIn: "7d" } // Token expires in 7 days
    );
};
// POST /api/auth/register - Register a new user
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // Validate required fields
        if (!email || !password || !name) {
            return res
                .status(400)
                .json({ error: "Email, password, and name are required" });
        }
        // Check if user already exists
        const existingUser = await index_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res
                .status(400)
                .json({ error: "User with this email already exists" });
        }
        // Create user (default role is MEMBER) - storing password as plain text
        const user = await index_1.prisma.user.create({
            data: {
                email,
                passwordHash: password,
                name,
                role: "MEMBER", // Default role
            },
        });
        // Generate token
        const token = generateToken(user.id, user.email, user.role, user.isApproved);
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                isApproved: user.isApproved,
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Failed to register user" });
    }
};
exports.register = register;
// POST /api/auth/login - Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        // Find user
        const user = await index_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({ error: "Account is deactivated" });
        }
        // Verify password (plain text comparison per user request)
        if (password !== user.passwordHash) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        // Generate token
        const token = generateToken(user.id, user.email, user.role, user.isApproved);
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                isApproved: user.isApproved,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Failed to login" });
    }
};
exports.login = login;
// GET /api/auth/me - Get current user info
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        const user = await index_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isApproved: true,
                createdAt: true,
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        console.error("Get current user error:", error);
        res.status(500).json({ error: "Failed to get user info" });
    }
};
exports.getCurrentUser = getCurrentUser;
// PATCH /api/auth/me - Update current user profile
const updateCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        const { name, email } = req.body;
        // Build update data - only allow updating safe fields
        const updateData = {};
        if (name !== undefined) {
            if (name.trim().length < 2) {
                return res.status(400).json({ error: "Name must be at least 2 characters" });
            }
            updateData.name = name.trim();
        }
        if (email !== undefined) {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: "Invalid email format" });
            }
            // Check if email is already taken by another user
            const existingUser = await index_1.prisma.user.findUnique({
                where: { email },
            });
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ error: "Email is already taken" });
            }
            updateData.email = email.toLowerCase().trim();
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No valid fields to update" });
        }
        const updatedUser = await index_1.prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isApproved: true,
                createdAt: true,
            },
        });
        res.json(updatedUser);
    }
    catch (error) {
        console.error("Update current user error:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};
exports.updateCurrentUser = updateCurrentUser;
//# sourceMappingURL=authController.js.map