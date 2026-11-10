import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../app';

describe('Auth routes', () => {
  const email = `test-${Date.now()}@teamtasks.dev`;

  it('registers a user (201)', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Test', email, password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body).not.toHaveProperty('passwordHash');
  });

  it('rejects duplicate email (409)', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Test', email, password: 'password123' });

    expect(res.status).toBe(409);
  });

  it('rejects invalid body (400)', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'errado' });
    expect(res.status).toBe(400);
  });

  it('logs in with seed user (200)', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'owner@teamtasks.dev', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('rejects wrong password (401)', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'owner@teamtasks.dev', password: 'wrong' });

    expect(res.status).toBe(401);
  });
});
