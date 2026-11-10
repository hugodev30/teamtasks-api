import express, { Application, Request, Response } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import { authRoutes } from './modules/auth/auth.routes';

// Initialize the Express application instance
const app: Application = express();

// Global Middleware Configuration
app.use(express.json()); // Parses incoming JSON payloads

// Route Definitions
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);

app.use(errorHandler);

// Export the configured app instance
export default app;
