import { UserRole } from "@/types";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized access") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden access") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export const authorize = (userRole: UserRole, allowedRoles: UserRole[]) => {
  if (!allowedRoles.includes(userRole)) {
    throw new ForbiddenError("You do not have permission to perform this action.");
  }
  return true;
};
