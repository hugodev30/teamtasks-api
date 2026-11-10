import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../shared/errors/AppError';
import { loginSchema, registerSchema } from './auth.schemas';

export async function register(data: z.infer<typeof registerSchema>) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new AppError('Email already in use', 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
    },
  });

  const { passwordHash: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

export async function login(data: z.infer<typeof loginSchema>) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!existingUser) {
    throw new AppError('Invalid credentials', 401);
  }

  const passwordMatch = await bcrypt.compare(
    data.password,
    existingUser.passwordHash,
  );

  if (!passwordMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  return {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
  };
}
