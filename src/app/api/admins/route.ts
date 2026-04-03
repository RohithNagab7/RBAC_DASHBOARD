import { NextRequest } from "next/server";
import { adminController } from "@/modules/admin/admin.controller";
import { authorize } from "@/lib/rbac";
import { getAuthUser } from "@/lib/auth-context";
import { UserRole } from "@/types";
import { errorResponse } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    authorize(user.role, [UserRole.SUPER_ADMIN]);
    return adminController.createAdmin(req);
  } catch (error: any) {
    return errorResponse(error.message, 403);
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    authorize(user.role, [UserRole.SUPER_ADMIN]);
    return adminController.getAllAdmins(req);
  } catch (error: any) {
    return errorResponse(error.message, 403);
  }
}
