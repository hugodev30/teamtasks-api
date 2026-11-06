import express, { Application, Request, Response } from 'express';

// Initialize the Express application instance
const app: Application = express();

// Global Middleware Configuration
app.use(express.json()); // Parses incoming JSON payloads

// Route Definitions
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Export the configured app instance
export default app;
