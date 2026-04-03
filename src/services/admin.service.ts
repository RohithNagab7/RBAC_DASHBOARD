import api from "@/lib/api";

export interface AdminOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AdminData {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

class AdminService {
  async getAllAdmins(options: AdminOptions = {}) {
    const params = new URLSearchParams();
    if (options.page) params.append("page", options.page.toString());
    if (options.limit) params.append("limit", options.limit.toString());
    if (options.search) params.append("search", options.search);

    const response = await api.get(`/admins?${params.toString()}`);
    return response.data.data;
  }

  async createAdmin(data: AdminData) {
    const response = await api.post("/admins", data);
    return response.data.data;
  }

  async updateAdmin(id: string, data: Partial<AdminData>) {
    const response = await api.patch(`/admins/${id}`, data);
    return response.data.data;
  }

  async deleteAdmin(id: string) {
    const response = await api.delete(`/admins/${id}`);
    return response.data.data;
  }
}

export const adminService = new AdminService();
