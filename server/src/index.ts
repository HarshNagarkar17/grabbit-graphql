import express from "express";
import cors from "cors";
import { env } from "@/config/environment";
import { startApolloServer } from "./apollo/server";

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

const startServer = async () => {
  try {
    const port = env.PORT;

    await startApolloServer(app);
    app.listen(port, () => console.log(`server started at ${port}`));
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
