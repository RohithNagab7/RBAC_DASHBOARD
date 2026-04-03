import api from "@/lib/api";
import { UserRole } from "@/types";

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    role: UserRole;
    email: string;
  };
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post("/auth/login", { email, password });
    return response.data.data; // Assuming the standard response format { success, message, data }
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    return localStorage.getItem("token");
  }
}

export const authService = new AuthService();
