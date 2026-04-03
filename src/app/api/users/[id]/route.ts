import { NextRequest } from "next/server";
import { userController } from "@/modules/user/user.controller";
import { authorize } from "@/lib/rbac";
import { getAuthUser } from "@/lib/auth-context";
import { UserRole } from "@/types";
import { errorResponse } from "@/lib/response";

type Params = Promise<{ id: string }>

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = getAuthUser(req);
    authorize(user.role, [UserRole.SUPER_ADMIN, UserRole.ADMIN]);
    const { id } = await params;
    return userController.getUserById(req, id);
  } catch (error: any) {
    return errorResponse(error.message, 403);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = getAuthUser(req);
    authorize(user.role, [UserRole.SUPER_ADMIN, UserRole.ADMIN]);
    const { id } = await params;
    return userController.updateUser(req, id);
  } catch (error: any) {
    return errorResponse(error.message, 403);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = getAuthUser(req);
    authorize(user.role, [UserRole.SUPER_ADMIN, UserRole.ADMIN]);
    const { id } = await params;
    return userController.deleteUser(req, id);
  } catch (error: any) {
    return errorResponse(error.message, 403);
  }
}
