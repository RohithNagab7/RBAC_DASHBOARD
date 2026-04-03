import { NextRequest } from "next/server";
import { userService } from "./user.service";
import { successResponse, errorResponse } from "@/lib/response";
import { createUserSchema } from "@/lib/validation";
import connectDB from "@/lib/db";
import { UserRole } from "@/types";
import { getAuthUser } from "@/lib/auth-context";

export class UserController {
  async createUser(req: NextRequest) {
    try {
      const body = await req.json();
      const authUser = getAuthUser(req);

      const validation = createUserSchema.safeParse(body);
      if (!validation.success) {
        return errorResponse("Validation error", 400, validation.error.format());
      }

      const result = await userService.createUser(
        validation.data,
        authUser.userId,
        authUser.role
      );
      return successResponse("User created successfully", result, 201);
    } catch (error: any) {
      return errorResponse(error.message, 400);
    }
  }

  async getAllUsers(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const authUser = getAuthUser(req);

      const options = {
        page: parseInt(searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "10"),
        search: searchParams.get("search") || "",
      };

      const result = await userService.getAllUsers(
        options,
        authUser.userId,
        authUser.role
      );
      return successResponse("Users retrieved successfully", result);
    } catch (error: any) {
      return errorResponse(error.message, 400);
    }
  }

  async getUserById(req: NextRequest, id: string) {
    try {
      const authUser = getAuthUser(req);
      const result = await userService.getUserById(id, authUser.userId, authUser.role);
      return successResponse("User retrieved successfully", result);
    } catch (error: any) {
      return errorResponse(error.message, 404);
    }
  }

  async updateUser(req: NextRequest, id: string) {
    try {
      const body = await req.json();
      const authUser = getAuthUser(req);

      const result = await userService.updateUser(id, body, authUser.userId, authUser.role);
      return successResponse("User updated successfully", result);
    } catch (error: any) {
      return errorResponse(error.message, 400);
    }
  }

  async deleteUser(req: NextRequest, id: string) {
    try {
      const authUser = getAuthUser(req);
      const result = await userService.deleteUser(id, authUser.userId, authUser.role);
      return successResponse("User deleted successfully", result);
    } catch (error: any) {
      return errorResponse(error.message, 400);
    }
  }
}

export const userController = new UserController();
