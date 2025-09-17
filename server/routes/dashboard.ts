import { Router } from "express";
import { db } from "../db";
import { users, userResources, resources, userActivities } from "../db/schema";
import { eq, desc, count } from "drizzle-orm"; // ✅ import count directly

const router = Router();

// Dashboard route
router.get("/", async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.session.userId;

        // Fetch user info
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, userId));

        // Count saved resources ✅ FIXED
        const [{ savedResources }] = await db
            .select({ savedResources: count(userResources.id) })
            .from(userResources)
            .where(eq(userResources.userId, userId));

        // Recent activities
        const recentActivities = await db
            .select()
            .from(userActivities)
            .where(eq(userActivities.userId, userId))
            .orderBy(desc(userActivities.timestamp))
            .limit(5);

        // Recommended resources (just grab latest for now)
        const recommended = await db
            .select()
            .from(resources)
            .orderBy(desc(resources.createdAt))
            .limit(3);

        res.json({
            user: { id: user.id, username: user.username },
            stats: { savedResources: Number(savedResources) },
            recentActivities,
            recommended,
        });
    } catch (err) {
        next(err);
    }
});

export default router;
