import { schema } from "@/graphql/schema";
import { ApolloServer } from "@apollo/server";
import { Application, json } from "express";
import { expressMiddleware } from "@apollo/server/express4";
import logger from "@/utils/logger";
import { isProduction } from "@/config/environment";
import {
  authenticatedUser,
  AuthenticatedUserRequest,
} from "@/middleware/auth.middleware";
import {
  parse,
  getOperationAST,
  GraphQLFormattedErrorExtensions,
} from "graphql";
import { AuthenticationError, handleError, ServerError } from "@/utils/errors";

export const PUBLIC_OPEATIONS = ["Login"];

export const startApolloServer = async (app: Application) => {
  const server = new ApolloServer({
    schema,
    formatError: (formattedError) => {
      logger.error("GraphQL Error:", {
        message: formattedError.message,
        path: formattedError.path,
        extentions: formattedError.extensions,
        locations: formattedError.locations,
      });
      return {
        message: formattedError.message,
        path: formattedError.path || [],
        locations: formattedError.locations || [],
        extensions:
          (formattedError.extensions as GraphQLFormattedErrorExtensions) || [],
      };
    },
  });

  await server.start();

  app.use(
    "/graphql",
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authenticatedReq = req as AuthenticatedUserRequest;

        const operationName = req.body?.operationName || null;
        let parsedOperationName = operationName;

        if (!operationName && req.body?.query) {
          try {
            const document = parse(req.body?.query);
            const operation = getOperationAST(document);
            parsedOperationName = operation?.name?.value || null;
          } catch (error) {
            throw new ServerError("Failed to extract operation name");
          }
        }

        let user = null;

        const isIntrospection =
          req.body?.query?.includes("__schema") ||
          req.body?.query?.includes("__type") ||
          operationName?.toLowerCase().includes("introspection");

        try {
          const isAuthRequired =
            !PUBLIC_OPEATIONS.includes(parsedOperationName) && !isIntrospection;
          user = await authenticatedUser(authenticatedReq);
          if (isAuthRequired && !user)
            throw new AuthenticationError("Authentication token required");
        } catch (error) {
          return handleError(error);
        }

        return {
          user,
          req: authenticatedReq,
        };
      },
    })
  );
};
