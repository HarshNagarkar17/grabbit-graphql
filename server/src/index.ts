import express from "express";
import cors from "cors";
import { env } from "@/config/environment";
import { startApolloServer } from "./apollo/server";
import logger from "./utils/logger";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { connectDatabase, disconnectFromDatabase } from "./database/connection";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

app.get("/health", (_, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  try {
    await disconnectFromDatabase();
  } catch (error) {
    logger.error("Error during graceful shutdown", error);
    process.exit(1);
  }
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

const startServer = async () => {
  try {
    const port = env.PORT;

    await connectDatabase();
    await startApolloServer(app);
    app.use(notFoundHandler);

    app.use(errorHandler);

    app.listen(port, () => {
      logger.info(`🚀 Server running on http://localhost:${port}`);
      logger.info(`📊 GraphQL endpoint: http://localhost:${port}/graphql`);
      logger.info(`🏥 Health check: http://localhost:${port}/health`);
      logger.info(`🌍 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
