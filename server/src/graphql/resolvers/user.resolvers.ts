import { createUserSchema, loginSchema } from "@/models/user.model";
import { userService } from "@/services/user.service";
import { generateAuthTokens } from "@/utils/auth";
import { AuthorizationError, handleError } from "@/utils/errors";

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
