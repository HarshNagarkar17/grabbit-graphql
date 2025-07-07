import logger from "@/utils/logger";
import prisma from "./prisma";
import { DatabaseError } from "@/utils/errors";

export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error("Database connection test failed:", error);
    return false;
  }
};

export const connectDatabase = async (): Promise<void> => {
  try {
    logger.info("Connecting to database...");
    await prisma.$connect();

    const isConnected = testDatabaseConnection();

    if (!isConnected) throw new Error("Failed to connect to database");

    logger.info("Database connected..");
  } catch (error) {
    logger.error("Failed to connect to database", error);
    throw error;
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info("Database connection closed");
  } catch (error) {
    logger.error("Error disconnecting from database:", error);
    throw error;
  }
};

/**
 * Get database health status
 */
export const getDatabaseHealth = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: "connected",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "disconnected",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown database error",
    };
  }
};
