import express, { Application, Request, Response } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import { AppError } from './shared/errors/AppError';

// Initialize the Express application instance
const app: Application = express();

// Global Middleware Configuration
app.use(express.json()); // Parses incoming JSON payloads

// Route Definitions
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/test-error', (req, res, next) => {
  next(new AppError('User not found', 404));
});

app.use(errorHandler)

// Export the configured app instance
export default app;
