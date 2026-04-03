import api from "@/lib/api";

export interface UserOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UserData {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

class UserService {
  async getAllUsers(options: UserOptions = {}) {
    const params = new URLSearchParams();
    if (options.page) params.append("page", options.page.toString());
    if (options.limit) params.append("limit", options.limit.toString());
    if (options.search) params.append("search", options.search);

    const response = await api.get(`/users?${params.toString()}`);
    return response.data.data;
  }

  async createUser(data: UserData) {
    const response = await api.post("/users", data);
    return response.data.data;
  }

  async updateUser(id: string, data: Partial<UserData>) {
    const response = await api.patch(`/users/${id}`, data);
    return response.data.data;
  }

  async deleteUser(id: string) {
    const response = await api.delete(`/users/${id}`);
    return response.data.data;
  }
}

export const userService = new UserService();
