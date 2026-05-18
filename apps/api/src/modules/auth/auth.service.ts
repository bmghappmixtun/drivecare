import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import { nanoid } from "nanoid";
import { env } from "../../config/env.js";
import { prisma } from "../../db/prisma.js";
import { HttpError } from "../../utils/http.js";
import type { loginSchema, registerSchema } from "./auth.schemas.js";
import type { z } from "zod";

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new HttpError(409, "Email already registered");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      locale: input.locale
    }
  });

  return issueSession(user);
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user?.passwordHash) throw new HttpError(401, "Invalid credentials");

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw new HttpError(401, "Invalid credentials");

  return issueSession(user);
}

export async function refresh(refreshToken: string) {
  const tokenHash = await bcrypt.hash(refreshToken, 1);
  const candidates = await prisma.refreshToken.findMany({
    where: { revokedAt: null, expiresAt: { gt: new Date() } },
    include: { user: true }
  });

  const match = await findMatchingRefreshToken(refreshToken, candidates);
  if (!match) throw new HttpError(401, "Invalid refresh token");

  await prisma.refreshToken.update({
    where: { id: match.id },
    data: { revokedAt: new Date() }
  });

  void tokenHash;
  return issueSession(match.user);
}

async function issueSession(user: { id: string; email: string; role: "USER" | "ADMIN" }) {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_ACCESS_SECRET as Secret,
    { expiresIn: env.ACCESS_TOKEN_TTL as SignOptions["expiresIn"] }
  );
  const refreshToken = nanoid(64);
  const tokenHash = await bcrypt.hash(refreshToken, 12);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.refreshToken.create({
    data: { tokenHash, userId: user.id, expiresAt }
  });

  return {
    user: { id: user.id, email: user.email, role: user.role },
    accessToken,
    refreshToken
  };
}

async function findMatchingRefreshToken(
  token: string,
  rows: Array<{ id: string; tokenHash: string; user: { id: string; email: string; role: "USER" | "ADMIN" } }>
) {
  for (const row of rows) {
    if (await bcrypt.compare(token, row.tokenHash)) return row;
  }
  return null;
}
