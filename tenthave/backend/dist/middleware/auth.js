"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireApprovedUser = exports.requireAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Verify JWT token
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({ error: "Access token required" });
        }
        const secret = process.env.JWT_SECRET || "your-secret-key";
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Invalid or expired token" });
            }
            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
                isApproved: decoded.isApproved,
            };
            next();
        });
    }
    catch (error) {
        res.status(500).json({ error: "Authentication failed" });
    }
};
exports.authenticateToken = authenticateToken;
// Check if user is admin
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
    }
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Admin access required" });
    }
    next();
};
exports.requireAdmin = requireAdmin;
// Check if user is approved (or admin who bypasses approval)
const requireApprovedUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
    }
    // Admins bypass approval requirement
    if (req.user.role === "ADMIN") {
        return next();
    }
    // Check if user is approved
    if (!req.user.isApproved) {
        return res.status(403).json({
            error: "Your account is pending admin approval",
            code: "APPROVAL_REQUIRED",
        });
    }
    next();
};
exports.requireApprovedUser = requireApprovedUser;
//# sourceMappingURL=auth.js.map