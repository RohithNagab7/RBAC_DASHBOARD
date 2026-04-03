import { NextRequest } from "next/server";
import { adminController } from "@/modules/admin/admin.controller";
import { authorize } from "@/lib/rbac";
import { getAuthUser } from "@/lib/auth-context";
import { UserRole } from "@/types";
import { errorResponse } from "@/lib/response";

type Params = Promise<{ id: string }>

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = getAuthUser(req);
    authorize(user.role, [UserRole.SUPER_ADMIN]);
    const { id } = await params;
    return adminController.getAdminById(req, id);
  } catch (error: any) {
    return errorResponse(error.message, 403);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = getAuthUser(req);
    authorize(user.role, [UserRole.SUPER_ADMIN]);
    const { id } = await params;
    return adminController.updateAdmin(req, id);
  } catch (error: any) {
    return errorResponse(error.message, 403);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = getAuthUser(req);
    authorize(user.role, [UserRole.SUPER_ADMIN]);
    const { id } = await params;
    return adminController.deleteAdmin(req, id);
  } catch (error: any) {
    return errorResponse(error.message, 403);
  }
}
