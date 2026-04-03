import { NextRequest } from "next/server";
import { adminService } from "./admin.service";
import { successResponse, errorResponse } from "@/lib/response";
import { createAdminSchema } from "@/lib/validation";
import connectDB from "@/lib/db";
import { UserRole } from "@/types";
import { getAuthUser } from "@/lib/auth-context";

export class AdminController {
  async createAdmin(req: NextRequest) {
    try {
      const body = await req.json();
      const authUser = getAuthUser(req);

      const validation = createAdminSchema.safeParse(body);
      if (!validation.success) {
        return errorResponse("Validation error", 400, validation.error.format());
      }

      const result = await adminService.createAdmin(validation.data, authUser.userId);
      return successResponse("Admin created successfully", result, 201);
    } catch (error: any) {
      return errorResponse(error.message, 400);
    }
  }

  async getAllAdmins(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const options = {
        page: parseInt(searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "10"),
        search: searchParams.get("search") || "",
      };

      const result = await adminService.getAllAdmins(options);
      return successResponse("Admins retrieved successfully", result);
    } catch (error: any) {
      return errorResponse(error.message, 400);
    }
  }

  async getAdminById(req: NextRequest, id: string) {
    try {
      const result = await adminService.getAdminById(id);
      return successResponse("Admin retrieved successfully", result);
    } catch (error: any) {
      return errorResponse(error.message, 404);
    }
  }

  async updateAdmin(req: NextRequest, id: string) {
    try {
      const body = await req.json();

      const result = await adminService.updateAdmin(id, body);
      return successResponse("Admin updated successfully", result);
    } catch (error: any) {
      return errorResponse(error.message, 400);
    }
  }

  async deleteAdmin(req: NextRequest, id: string) {
    try {
      const result = await adminService.deleteAdmin(id);
      return successResponse("Admin deleted successfully", result);
    } catch (error: any) {
      return errorResponse(error.message, 400);
    }
  }
}

export const adminController = new AdminController();
