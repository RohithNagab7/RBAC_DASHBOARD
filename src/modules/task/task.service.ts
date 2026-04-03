import { taskRepository } from "@/repositories/task.repository";
import { UserRole } from "@/types";

export class TaskService {
  async createTask(taskData: any, userId: string) {
    return taskRepository.create({
      ...taskData,
      createdBy: userId as any,
    });
  }

  async getAllTasks(options: any = {}, userId: string) {
    const filter = { createdBy: userId };
    return taskRepository.findAll(filter, options);
  }

  async getTaskById(id: string, userId: string) {
    const task = await taskRepository.findById(id);

    if (!task || task.createdBy.toString() !== userId) {
      throw new Error("Task not found or access denied");
    }

    return task;
  }

  async updateTask(id: string, updateData: any, userId: string) {
    const task = await this.getTaskById(id, userId);
    return taskRepository.update(id, updateData);
  }

  async deleteTask(id: string, userId: string) {
    const task = await this.getTaskById(id, userId);
    return taskRepository.delete(id);
  }
}

export const taskService = new TaskService();
