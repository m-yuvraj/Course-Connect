import { Router } from "express";
import { storage } from "../storage";

const router = Router();

// GET all resources
router.get("/", async (req, res) => {
    const resources = await storage.getResources();
    res.json(resources);
});

// GET resource by ID
router.get("/:id", async (req, res) => {
    const resource = await storage.getResourceById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json(resource);
});

// POST create new resource
router.post("/", async (req, res) => {
    try {
        const resource = await storage.createResource(req.body);
        res.status(201).json(resource);
    } catch (err) {
        res.status(400).json({ message: "Invalid resource data", error: err });
    }
});

// GET search resources
router.get("/search", async (req, res) => {
    const q = req.query.q as string;
    const type = req.query.type as string | undefined;

    if (!q) return res.status(400).json({ message: "Query parameter 'q' is required" });

    const results = await storage.searchResources(q, type);
    res.json(results);
});

export default router;
