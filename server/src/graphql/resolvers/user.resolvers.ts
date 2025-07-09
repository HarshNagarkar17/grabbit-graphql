import { createUserSchema, loginSchema } from "@/models/user.model";
import { userService } from "@/services/user.service";
import { generateAuthTokens } from "@/utils/auth";
import { AppError, AuthorizationError } from "@/utils/errors";
import { GraphQLError } from "graphql";
import { ZodError } from "zod";

const handleError = (error: unknown): never => {
  if (error instanceof AppError) {
    throw new GraphQLError(error.message, {
      extensions: {
        code:
          error.statusCode === 401
            ? "UNAUTHENTICATED"
            : error.statusCode === 403
              ? "FORBIDDEN"
              : error.statusCode === 404
                ? "NOT_FOUND"
                : error.statusCode === 409
                  ? "CONFLICT"
                  : "BAD_REQUEST",
        http: { status: 200 },
      },
    });
  }

  if (error instanceof ZodError) {
    throw new GraphQLError(error.errors[0]?.message || "Validation failed", {
      extensions: {
        code: "BAD_REQUEST",
        http: { status: 400 },
      },
    });
  }

  throw new GraphQLError("Internal server error", {
    extensions: { code: "INTERNAL_SERVER_ERROR", http: { status: 500 } },
  });
};

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, context: { user?: { id: string } | null }) => {
      if (!context.user)
        throw new AuthorizationError("Authorization is required");

      const user = await userService.getUserFromID(context.user.id);
      return user;
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
  },
};
