import prisma from "@/database/prisma";
import { createUserSchema, loginSchema } from "@/models/user.model";
import { userService } from "@/services/user.service";
import { generateAuthTokens } from "@/utils/auth";
import {
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  handleError,
  NotFoundError,
} from "@/utils/errors";

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, context: { user?: { id: string } | null }) => {
      try {
        if (!context.user)
          throw new AuthorizationError("Authorization is required");

        const user = await userService.getUserFromID(context.user.id);
        return user;
      } catch (error) {
        return handleError(error);
      }
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      args: { input: { email: string; username: string; password: string } }
    ) => {
      try {
        const validatedInput = createUserSchema.parse(args.input);
        const result = await userService.createUser(validatedInput);
        const tokens = await generateAuthTokens(result.id);

        return { user: result, tokens };
      } catch (error) {
        return handleError(error);
      }
    },
    login: async (
      _: any,
      args: { input: { email: string; password: string } }
    ) => {
      try {
        const validatedInput = loginSchema.parse(args.input);
        const result = await userService.login(validatedInput);
        const tokens = await generateAuthTokens(result.id);

        return { user: result, tokens };
      } catch (error) {
        return handleError(error);
      }
    },
    updateUser: async (
      _: any,
      args: { input: { username: string; email: string } },
      context: { user: { id: string } }
    ) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: context.user.id },
        });

        if (!user) throw new NotFoundError("User not found");

        const duplicateUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email: args.input.email },
              { username: args.input.username },
            ],
            NOT: { id: context.user.id },
          },
        });

        if (duplicateUser) {
          throw new ConflictError(
            "A user with the same email or username already exists"
          );
        }

        const updatedUser = await prisma.user.update({
          where: { id: context.user.id },
          data: { email: args.input.email, username: args.input.username },
        });
        const { password, ...userWithoutpassword } = updatedUser;
        return userWithoutpassword;
      } catch (error) {
        return handleError(error);
      }
    },
  },
};
