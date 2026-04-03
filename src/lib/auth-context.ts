import { NextRequest } from "next/server";
import { UserRole } from "@/types";

export interface AuthUser {
  userId: string;
  role: UserRole;
  email: string;
}

export const getAuthUser = (req: NextRequest): AuthUser => {
  const userId = req.headers.get("x-user-id");
  const role = req.headers.get("x-user-role");
  const email = req.headers.get("x-user-email");

  if (!userId || !role) {
    throw new Error("User NOT found in request context. Make sure middleware is applied.");
  }

  return {
    userId,
    role: role as UserRole,
    email: email || "",
  };
};
