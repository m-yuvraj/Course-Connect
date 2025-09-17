// server/routes/auth.ts
import { Router } from "express";
import { storage } from "../storage";
import bcrypt from "bcrypt";

const router = Router();

// Register
router.post("/register", async (req, res, next) => {
    try {
        const { username, password, firstName, lastName } = req.body;

        const existing = await storage.getUserByUsername(username);
        if (existing) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await storage.createUser({
            username,
            password: hashedPassword,
            firstName,
            lastName,
            preferences: {}, // default
        });

        req.session.userId = user.id;
        res.json({ id: user.id, username: user.username });
    } catch (err) {
        next(err);
    }
});

// Login
router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await storage.getUserByUsername(username);

        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: "Invalid credentials" });

        req.session.userId = user.id;
        res.json({ id: user.id, username: user.username });
    } catch (err) {
        next(err);
    }
});

// Logout
router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out" });
    });
});

export default router;
