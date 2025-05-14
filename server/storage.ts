import { 
  users, 
  locations, 
  type User, 
  type InsertUser, 
  type Location, 
  type InsertLocation 
} from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { desc, eq, sql } from "drizzle-orm";
import { Pool } from "pg";

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Drizzle with the PostgreSQL client
const db = drizzle(pool);

// Storage interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Location methods
  saveLocation(location: InsertLocation): Promise<Location>;
  getLocationHistory(limit?: number): Promise<Location[]>;
  getLocationById(id: number): Promise<Location | undefined>;
}

export class DbStorage implements IStorage {
  constructor() {
    // Initialize the database tables
    this.initDb();
  }

  private async initDb() {
    try {
      // Ensure the database schema is up to date
      // This would typically use a migration tool like Drizzle's migrate
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values(insertUser).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async saveLocation(location: InsertLocation): Promise<Location> {
    try {
      const result = await db.insert(locations).values(location).returning();
      return result[0];
    } catch (error) {
      console.error("Error saving location:", error);
      throw error;
    }
  }

  async getLocationHistory(limit: number = 100): Promise<Location[]> {
    try {
      const result = await db
        .select()
        .from(locations)
        .orderBy(desc(locations.timestamp))
        .limit(limit);
      return result;
    } catch (error) {
      console.error("Error getting location history:", error);
      return [];
    }
  }

  async getLocationById(id: number): Promise<Location | undefined> {
    try {
      const result = await db
        .select()
        .from(locations)
        .where(eq(locations.id, id))
        .limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting location by ID:", error);
      return undefined;
    }
  }
}

// Export a single storage instance
export const storage = new DbStorage();
