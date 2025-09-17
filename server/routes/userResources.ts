import { Router } from "express";
import { storage } from "../storage";

const router = Router();

// Get all resources saved by a user
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    const resources = await storage.getUserResources(userId);
    res.json(resources);
});

// Get a specific user resource
router.get("/:userId/:resourceId", async (req, res) => {
    const { userId, resourceId } = req.params;
    const userResource = await storage.getUserResource(userId, resourceId);

    if (!userResource) return res.status(404).json({ message: "Not found" });
    res.json(userResource);
});

// Save/bookmark a new user resource
router.post("/", async (req, res) => {
    try {
        const userResource = await storage.createUserResource(req.body);
        res.status(201).json(userResource);
    } catch (err) {
        res.status(400).json({ message: "Invalid data", error: err });
    }
});

// Update progress or status of a user resource
router.put("/:id", async (req, res) => {
    try {
        const updated = await storage.updateUserResource(req.params.id, req.body);

        if (!updated) return res.status(404).json({ message: "Not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: "Invalid update", error: err });
    }
});

export default router;
