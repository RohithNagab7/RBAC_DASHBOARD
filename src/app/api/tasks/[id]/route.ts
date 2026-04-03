import { NextRequest } from "next/server";
import { taskController } from "@/modules/task/task.controller";
import { authorize } from "@/lib/rbac";
import { getAuthUser } from "@/lib/auth-context";
import { UserRole } from "@/types";
import { errorResponse } from "@/lib/response";

type Params = Promise<{ id: string }>

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = getAuthUser(req);
    authorize(user.role, [UserRole.USER]);
    const { id } = await params;
    return taskController.getTaskById(req, id);
  } catch (error: any) {
    return errorResponse(error.message, 403);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = getAuthUser(req);
    authorize(user.role, [UserRole.USER]);
    const { id } = await params;
    return taskController.updateTask(req, id);
  } catch (error: any) {
    return errorResponse(error.message, 403);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const user = getAuthUser(req);
    authorize(user.role, [UserRole.USER]);
    const { id } = await params;
    return taskController.deleteTask(req, id);
  } catch (error: any) {
    return errorResponse(error.message, 403);
  }
}
