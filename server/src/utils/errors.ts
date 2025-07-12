import { GraphQLError } from "graphql";
import { ZodError } from "zod";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Access denied") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict") {
    super(message, 409);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed") {
    super(message, 500);
  }
}

export class ServerError extends AppError {
  constructor(
    message: string = "Internal server error",
    statusCode: number = 500
  ) {
    super(message, statusCode);
  }
}

export const handleError = (error: unknown): never => {
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
