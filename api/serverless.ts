import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example API routes
app.get("/ping", (_req, res) => {
  res.json({ message: "Hello from Express server v2!" });
});

// Health check route
app.get("/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Handle 404 for other routes
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default serverless(app);
