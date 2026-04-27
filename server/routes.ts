import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLocationSchema } from "@shared/schema";
import { z } from "zod";
import { Resend } from "resend";

// Initialize Resend client
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;
// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(1, "Message is required")
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy" });
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      if (!resend) {
        console.error("Resend client not initialized - missing API key");
        return res.status(500).json({ message: "Email service not configured" });
      };
      
      // Send email using Resend
      if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is not set");
        return res.status(500).json({ message: "Email service not configured" });
      }

      if (!process.env.CONTACT_EMAIL) {
        console.error("CONTACT_EMAIL is not set");
        return res.status(500).json({ message: "Contact email not configured" });
      }

      await resend.emails.send({
        from: 'EarthSpin Contact Form <onboarding@resend.dev>',
        to: [process.env.CONTACT_EMAIL],
        subject: `EarthSpin Contact: Message from ${validatedData.name}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Message:</strong></p>
          <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Sent at: ${new Date().toISOString()}</small></p>
        `,
        replyTo: validatedData.email
      });
      
      console.log("Contact form email sent successfully");
      res.status(200).json({ message: "Message sent successfully!" });
    } catch (error) {
      console.error("Error processing contact form:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid form data",
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Failed to send message. Please try again." });
    }
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
