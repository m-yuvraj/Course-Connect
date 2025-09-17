import {
  type User,
  type InsertUser,
  type Resource,
  type InsertResource,
  type UserResource,
  type InsertUserResource,
  type ChatMessage,
  type InsertChatMessage,
  type UserActivity,
  type InsertUserActivity,
} from "@shared/schema";
import { randomUUID } from "crypto";
import session, { Store } from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getResources(): Promise<Resource[]>;
  getResourceById(id: string): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  searchResources(query: string, type?: string): Promise<Resource[]>;

  getUserResources(userId: string): Promise<(UserResource & { resource: Resource })[]>;
  getUserResource(userId: string, resourceId: string): Promise<UserResource | undefined>;
  createUserResource(userResource: InsertUserResource): Promise<UserResource>;
  updateUserResource(id: string, updates: Partial<UserResource>): Promise<UserResource | undefined>;

  getChatMessages(userId: string): Promise<ChatMessage[]>;
  createChatMessage(chatMessage: InsertChatMessage): Promise<ChatMessage>;

  getUserActivity(userId: string): Promise<UserActivity[]>;
  createUserActivity(activity: InsertUserActivity): Promise<UserActivity>;

  sessionStore: Store;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private resources: Map<string, Resource>;
  private userResources: Map<string, UserResource>;
  private chatMessages: Map<string, ChatMessage>;
  private userActivities: Map<string, UserActivity>;
  public sessionStore: Store;

  constructor() {
    this.users = new Map();
    this.resources = new Map();
    this.userResources = new Map();
    this.chatMessages = new Map();
    this.userActivities = new Map();
    this.sessionStore = new MemoryStore({ checkPeriod: 86400000 });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      preferences: insertUser.preferences ?? {},
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResourceById(id: string): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = randomUUID();
    const resource: Resource = {
      ...insertResource,
      id,
      url: insertResource.url ?? null,
      description: insertResource.description ?? null,
      thumbnailUrl: insertResource.thumbnailUrl ?? null,
      rating: insertResource.rating ?? 0,
      difficulty: insertResource.difficulty ?? null,
      metadata: insertResource.metadata ?? {},
      createdAt: new Date(),
    };
    this.resources.set(id, resource);
    return resource;
  }

  async searchResources(query: string, type?: string): Promise<Resource[]> {
    const allResources = Array.from(this.resources.values());
    return allResources.filter(resource => {
      const matchesQuery =
        resource.title.toLowerCase().includes(query.toLowerCase()) ||
        resource.description?.toLowerCase().includes(query.toLowerCase());
      const matchesType = !type || resource.type === type;
      return matchesQuery && matchesType;
    });
  }

  async getUserResources(userId: string): Promise<(UserResource & { resource: Resource })[]> {
    const userResources = Array.from(this.userResources.values()).filter(ur => ur.userId === userId);
    return userResources.map(ur => ({
      ...ur,
      resource: this.resources.get(ur.resourceId)!,
    }));
  }

  async getUserResource(userId: string, resourceId: string): Promise<UserResource | undefined> {
    return Array.from(this.userResources.values()).find(ur => ur.userId === userId && ur.resourceId === resourceId);
  }

  async createUserResource(insertUserResource: InsertUserResource): Promise<UserResource> {
    const id = randomUUID();
    const userResource: UserResource = {
      ...insertUserResource,
      id,
      status: insertUserResource.status ?? "saved",
      progress: insertUserResource.progress ?? 0,
      bookmarked: insertUserResource.bookmarked ?? false,
      notes: insertUserResource.notes ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userResources.set(id, userResource);
    return userResource;
  }

  async updateUserResource(id: string, updates: Partial<UserResource>): Promise<UserResource | undefined> {
    const existing = this.userResources.get(id);
    if (!existing) return undefined;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.userResources.set(id, updated);
    return updated;
  }

  async getChatMessages(userId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.userId === userId)
      .sort((a, b) => a.timestamp!.getTime() - b.timestamp!.getTime());
  }

  async createChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const chatMessage: ChatMessage = {
      ...insertChatMessage,
      id,
      response: insertChatMessage.response ?? null,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }

  async getUserActivity(userId: string): Promise<UserActivity[]> {
    return Array.from(this.userActivities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.timestamp!.getTime() - a.timestamp!.getTime());
  }

  async createUserActivity(insertActivity: InsertUserActivity): Promise<UserActivity> {
    const id = randomUUID();
    const activity: UserActivity = {
      ...insertActivity,
      id,
      metadata: insertActivity.metadata ?? {},
      timestamp: new Date(),
    };
    this.userActivities.set(id, activity);
    return activity;
  }
}

export const storage = new MemStorage();
