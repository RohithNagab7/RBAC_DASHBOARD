import { userRepository } from "@/repositories/user.repository";
import { hashPassword } from "@/lib/bcrypt";
import { UserRole } from "@/types";
import { authorize } from "@/lib/rbac";

export class AdminService {
  async createAdmin(adminData: any, superAdminId: string) {
    const { name, email, password, phone } = adminData;

    if (await userRepository.exists(email)) {
      throw new Error("Admin with this email already exists");
    }

    const hashedPassword = await hashPassword(password);
    
    return userRepository.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: UserRole.ADMIN,
      createdBy: superAdminId as any,
    });
  }

  async getAllAdmins(options: any = {}) {
    return userRepository.findAll({ role: UserRole.ADMIN }, options);
  }

  async getAdminById(id: string) {
    const admin = await userRepository.findById(id);
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new Error("Admin not found");
    }
    return admin;
  }

  async updateAdmin(id: string, updateData: any) {
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }
    return userRepository.update(id, updateData);
  }

  async deleteAdmin(id: string) {
    return userRepository.delete(id);
  }
}

export const adminService = new AdminService();
