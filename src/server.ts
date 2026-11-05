import express from 'express';
import type { Express, Request, Response } from 'express';

const app: Express = express();
const port = process.env.PORT ?? 3333;

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
