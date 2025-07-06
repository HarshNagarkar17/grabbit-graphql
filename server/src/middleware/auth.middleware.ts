import { Request } from "express";
import { extractTokenFromHeader, verifyToken } from "@/utils/auth";
interface AuthenticatedUser {
  id: string;
}
export interface AuthenticatedUserRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticatedUser = async (
  req: AuthenticatedUserRequest
): Promise<AuthenticatedUser | null> => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return null;
    }
    const token = extractTokenFromHeader(authorizationHeader);
    const user = await verifyToken(token);

    req.user = user;

    return user;
  } catch (error) {
    return null;
  }
};
