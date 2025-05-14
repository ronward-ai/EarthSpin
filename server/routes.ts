import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLocationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy" });
  });

  // Location endpoints
  
  // Save a location
  app.post("/api/locations", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertLocationSchema.parse(req.body);
      
      // Save location to database
      const savedLocation = await storage.saveLocation(validatedData);
      
      res.status(201).json(savedLocation);
    } catch (error) {
      console.error("Error saving location:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid location data",
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Error saving location" });
    }
  });
  
  // Get location history
  app.get("/api/locations", async (req, res) => {
    try {
      // Extract limit from query params, default to 100
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      
      // Get location history
      const locations = await storage.getLocationHistory(limit);
      
      res.json(locations);
    } catch (error) {
      console.error("Error retrieving locations:", error);
      res.status(500).json({ message: "Error retrieving location history" });
    }
  });
  
  // Get location by ID
  app.get("/api/locations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid location ID" });
      }
      
      const location = await storage.getLocationById(id);
      
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      
      res.json(location);
    } catch (error) {
      console.error("Error retrieving location:", error);
      res.status(500).json({ message: "Error retrieving location" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
