import prisma from "@/lib/prisma";
import {
  CreateUserInput,
  LoginInput,
  UserWithoutPassword,
} from "@/models/user.model";
import { comparePassword, hashPassword } from "@/utils/auth";
import {
  AppError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "@/utils/errors";

export class UserService {
  async createUser(input: CreateUserInput): Promise<UserWithoutPassword> {
    try {
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email: input.email }, { username: input.username }] },
      });

      if (existingUser) {
        if (existingUser.email === input.email) {
          throw new ValidationError("User with email already exists");
        } else {
          throw new ValidationError("User with username already exists");
        }
      }

      const hashedPassword = await hashPassword(input.password);

      const user = await prisma.user.create({
        data: {
          email: input.email,
          username: input.username,
          password: hashedPassword,
        },
      });
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new DatabaseError("Failed to create user!");
    }
  }

  async login(input: LoginInput): Promise<UserWithoutPassword> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user || !(await comparePassword(input.password, user.password))) {
        throw new NotFoundError("Invaid email or password");
      }
      const { password, ...userWithoutpassword } = user;
      return userWithoutpassword;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new DatabaseError("Failed to login user");
    }
  }
}

export const userService = new UserService();
