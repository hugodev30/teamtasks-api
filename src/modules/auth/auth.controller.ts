// src/modules/auth/auth.controller.ts
import { Request, Response } from 'express';
import { registerSchema, loginSchema } from './auth.schemas';
import * as authService from './auth.service';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';

export async function registerController(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);
  const user = await authService.register(data);
  return res.status(201).json(user);
}

export async function loginController(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);
  const user = await authService.login(data);

  const token = jwt.sign({ sub: user.id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as NonNullable<SignOptions['expiresIn']>,
  });

  return res.status(200).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}
