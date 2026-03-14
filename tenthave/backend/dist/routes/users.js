"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All user management routes require admin access
router.use(auth_1.authenticateToken, auth_1.requireAdmin);
// GET /api/users - Get all users
router.get("/", userController_1.getUsers);
// GET /api/users/:id - Get a specific user
router.get("/:id", userController_1.getUser);
// PUT /api/users/:id - Update user
router.put("/:id", userController_1.updateUser);
// PATCH /api/users/:id/approval - Update user approval status
router.patch("/:id/approval", userController_1.updateUserApproval);
// DELETE /api/users/:id - Delete user
router.delete("/:id", userController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=users.js.map