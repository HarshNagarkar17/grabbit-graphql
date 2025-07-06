import { isDevelopment } from "@/config/environment";
import logger from "@/utils/logger";
import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  const client = new PrismaClient({
    log: [
      { level: "query", emit: "event" },
      { level: "error", emit: "stdout" },
      { level: "info", emit: "stdout" },
      { level: "warn", emit: "stdout" },
    ],
  });

  if (isDevelopment) {
    client.$on("query", (e) => {
      logger.debug("Query: ", e.query);
      logger.debug("Params: ", e.params);
      logger.debug("Duration: ", e.duration + "ms");
    });
  }
  return client;
};

export const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

// Graceful shutdown
const gracefulShutdown = async () => {
  logger.info("Shutting down prisma client...");
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

export default prisma;
