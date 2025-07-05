import { env } from "@/config/environment";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticationError } from "./errors";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export enum TokenExpiry {
  ONE_HOUR = "1h",
  ONE_DAY = "1d",
  SEVEN_DAYS = "7d",
  THIRTY_MINUTES = "30m",
}

const generateToken = async (
  payload: { id: string },
  exp: TokenExpiry = TokenExpiry.ONE_HOUR
) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: exp });
};

export const verifyToken = async (token: string): Promise<{ id: string }> => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as { id: string };
  } catch (error) {
    throw new AuthenticationError("Invalid or expired token");
  }
};

export const generateAuthTokens = async (id: string) => {
  const accessToken = await generateToken({ id }, TokenExpiry.ONE_DAY);
  const refreshToken = await generateToken({ id }, TokenExpiry.SEVEN_DAYS);
  return { accessToken, refreshToken };
};

export const extractTokenFromHeader = (authorization?: string): string => {
  if (!authorization) {
    throw new AuthenticationError("Authorization header is required");
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer" || !token) {
    throw new AuthenticationError("Invalid authorization header format");
  }

  return token;
};
