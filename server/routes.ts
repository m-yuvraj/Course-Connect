import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { getAIRecommendations, getChatResponse, summarizeContent } from "./services/ai";
import { searchYouTubeVideos } from "./services/youtube";
import { insertResourceSchema, insertUserResourceSchema, insertChatMessageSchema, insertUserActivitySchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Authentication routes
  setupAuth(app);

  // Search endpoint
  app.get("/api/search", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { query, type } = req.query as { query: string; type?: string };
      if (!query) return res.status(400).json({ message: "Query parameter is required" });

      // Search local resources
      const localResources = await storage.searchResources(query, type);
      
      // Search YouTube if video type
      let youtubeVideos: any[] = [];
      if (!type || type === 'video') {
        youtubeVideos = await searchYouTubeVideos(query);
      }

      // Get AI recommendations
      const recommendations = await getAIRecommendations(query, req.user!.id);

      res.json({
        localResources,
        youtubeVideos,
        recommendations
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Resources endpoints
  app.get("/api/resources", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const resources = await storage.getResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.post("/api/resources", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const validatedData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(validatedData);
      res.status(201).json(resource);
    } catch (error) {
      res.status(400).json({ message: "Invalid resource data" });
    }
  });

  // User resources endpoints
  app.get("/api/user-resources", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const userResources = await storage.getUserResources(req.user!.id);
      res.json(userResources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user resources" });
    }
  });

  app.post("/api/user-resources", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const validatedData = insertUserResourceSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const userResource = await storage.createUserResource(validatedData);
      
      // Log activity
      await storage.createUserActivity({
        userId: req.user!.id,
        action: 'resource_saved',
        description: `Saved resource: ${req.body.resourceTitle || 'Unknown'}`,
        metadata: { resourceId: req.body.resourceId }
      });
      
      res.status(201).json(userResource);
    } catch (error) {
      res.status(400).json({ message: "Invalid user resource data" });
    }
  });

  app.patch("/api/user-resources/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const updatedResource = await storage.updateUserResource(req.params.id, req.body);
      if (!updatedResource) return res.status(404).json({ message: "Resource not found" });
      
      res.json(updatedResource);
    } catch (error) {
      res.status(500).json({ message: "Failed to update resource" });
    }
  });

  // Chat endpoints
  app.get("/api/chat", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const messages = await storage.getChatMessages(req.user!.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { message } = req.body;
      if (!message) return res.status(400).json({ message: "Message is required" });

      // Get AI response
      const response = await getChatResponse(message);
      
      // Save chat message
      const chatMessage = await storage.createChatMessage({
        userId: req.user!.id,
        message,
        response
      });

      // Log activity
      await storage.createUserActivity({
        userId: req.user!.id,
        action: 'ai_chat',
        description: `Asked AI buddy about: ${message.substring(0, 50)}...`,
        metadata: { messageId: chatMessage.id }
      });

      res.json(chatMessage);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Content summarization endpoint
  app.post("/api/summarize", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { content, url } = req.body;
      if (!content && !url) return res.status(400).json({ message: "Content or URL is required" });

      const summary = await summarizeContent(content || url);
      res.json({ summary });
    } catch (error) {
      res.status(500).json({ message: "Failed to summarize content" });
    }
  });

  // Activity endpoint
  app.get("/api/activity", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const activities = await storage.getUserActivity(req.user!.id);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Recommendations endpoint
  app.get("/api/recommendations", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);
      
      const { topic } = req.query as { topic?: string };
      const recommendations = await getAIRecommendations(topic || "general", req.user!.id);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
