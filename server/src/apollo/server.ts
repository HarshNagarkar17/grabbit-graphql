import { schema } from "@/graphql/schema";
import { ApolloServer } from "@apollo/server";
import { Application, json } from "express";
import { expressMiddleware } from "@apollo/server/express4";

export const startApolloServer = async (app: Application) => {
  const server = new ApolloServer({
    schema,
  });

  await server.start();

  app.use("/graphql", json(), expressMiddleware(server));
};
