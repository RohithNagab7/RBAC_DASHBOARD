import { NextRequest } from "next/server";
import { userController } from "@/modules/user/user.controller";
import { authorize } from "@/lib/rbac";
import { getAuthUser } from "@/lib/auth-context";
import { UserRole } from "@/types";
import { errorResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    authorize(user.role, [UserRole.SUPER_ADMIN, UserRole.ADMIN]);
    return userController.createUser(req);
  } catch (error: any) {
    return errorResponse(error.message, 403);
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    authorize(user.role, [UserRole.SUPER_ADMIN, UserRole.ADMIN]);
    return userController.getAllUsers(req);
  } catch (error: any) {
    return errorResponse(error.message, 403);
  }
}
