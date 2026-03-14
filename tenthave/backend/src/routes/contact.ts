import express from "express";
import { sendContactEmail } from "../controllers/contactController";

const router: express.Router = express.Router();

// POST /api/contact - Send contact form email
router.post("/", sendContactEmail);

export default router;

