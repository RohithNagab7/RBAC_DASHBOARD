import { NextRequest } from "next/server";
import { taskService } from "./task.service";
import { successResponse, errorResponse } from "@/lib/response";
import { createTaskSchema, updateTaskSchema } from "@/lib/validation";
import connectDB from "@/lib/db";
import { getAuthUser } from "@/lib/auth-context";

export class TaskController {
  async createTask(req: NextRequest) {
    try {
      const body = await req.json();
      const authUser = getAuthUser(req);

      const validation = createTaskSchema.safeParse(body);
      if (!validation.success) {
        return errorResponse("Validation error", 400, validation.error.format());
      }

      const result = await taskService.createTask(validation.data, authUser.userId);
      return successResponse("Task created successfully", result, 201);
    } catch (error: any) {
      return errorResponse(error.message, 400);
    }
  }

  async getAllTasks(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const authUser = getAuthUser(req);

      const options = {
        page: parseInt(searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "10"),
        search: searchParams.get("search") || "",
      };

      const result = await taskService.getAllTasks(options, authUser.userId);
      return successResponse("Tasks retrieved successfully", result);
    } catch (error: any) {
      return errorResponse(error.message, 400);
    }
  }

  async getTaskById(req: NextRequest, id: string) {
    try {
      const authUser = getAuthUser(req);
      const result = await taskService.getTaskById(id, authUser.userId);
      return successResponse("Task retrieved successfully", result);
    } catch (error: any) {
      return errorResponse(error.message, 404);
    }
  }

  async updateTask(req: NextRequest, id: string) {
    try {
      const body = await req.json();
      const authUser = getAuthUser(req);

      const validation = updateTaskSchema.safeParse(body);
      if (!validation.success) {
        return errorResponse("Validation error", 400, validation.error.format());
      }

      const result = await taskService.updateTask(id, validation.data, authUser.userId);
      return successResponse("Task updated successfully", result);
    } catch (error: any) {
      return errorResponse(error.message, 400);
    }
  }

  async deleteTask(req: NextRequest, id: string) {
    try {
      const authUser = getAuthUser(req);
      const result = await taskService.deleteTask(id, authUser.userId);
      return successResponse("Task deleted successfully", result);
    } catch (error: any) {
      return errorResponse(error.message, 400);
    }
  }
}

export const taskController = new TaskController();
