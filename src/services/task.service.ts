import api from "@/lib/api";

export interface TaskOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface TaskData {
  title: string;
  description?: string;
  status: "pending" | "completed";
  priority: "low" | "medium" | "high";
}

class TaskService {
  async getAllTasks(options: TaskOptions = {}) {
    const params = new URLSearchParams();
    if (options.page) params.append("page", options.page.toString());
    if (options.limit) params.append("limit", options.limit.toString());
    if (options.search) params.append("search", options.search);
    if (options.status) params.append("status", options.status);

    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data.data;
  }

  async createTask(data: TaskData) {
    const response = await api.post("/tasks", data);
    return response.data.data;
  }

  async updateTask(id: string, data: Partial<TaskData>) {
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data.data;
  }

  async deleteTask(id: string) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data.data;
  }
}

export const taskService = new TaskService();
