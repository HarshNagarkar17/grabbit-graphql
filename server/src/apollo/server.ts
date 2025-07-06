import { schema } from "@/graphql/schema";
import { ApolloServer } from "@apollo/server";
import { Application, json } from "express";
import { expressMiddleware } from "@apollo/server/express4";
import logger from "@/utils/logger";
import { isProduction } from "@/config/environment";

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
        ...(isProduction && {
          extensions: formattedError.extensions,
        }),
      };
    },
  });

  await server.start();

  app.use("/graphql", json(), expressMiddleware(server));
};
