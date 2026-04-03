import { userRepository } from "@/repositories/user.repository";
import { hashPassword } from "@/lib/bcrypt";
import { UserRole } from "@/types";

export class UserService {
  async createUser(userData: any, creatorId: string, creatorRole: UserRole) {
    const { name, email, password, phone, adminId } = userData;

    if (await userRepository.exists(email)) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await hashPassword(password);
    
    const targetCreatorId = (creatorRole === UserRole.SUPER_ADMIN && adminId) 
      ? adminId 
      : creatorId;

    return userRepository.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: UserRole.USER,
      createdBy: targetCreatorId as any,
    });
  }

  async getAllUsers(options: any = {}, requesterId: string, requesterRole: UserRole) {
    let filter: any = { role: UserRole.USER };

    if (requesterRole === UserRole.ADMIN) {
      filter.createdBy = requesterId;
    } else if (requesterRole !== UserRole.SUPER_ADMIN) {
      throw new Error("Unauthorized access");
    }

    return userRepository.findAll(filter, options);
  }

  async getUserById(id: string, requesterId: string, requesterRole: UserRole) {
    const user = await userRepository.findById(id);
    if (!user || user.role !== UserRole.USER) {
      throw new Error("User not found");
    }

    if (requesterRole === UserRole.ADMIN && user.createdBy?.toString() !== requesterId) {
      throw new Error("Forbidden: Access denied to this user.");
    }

    return user;
  }

  async updateUser(id: string, updateData: any, requesterId: string, requesterRole: UserRole) {
    const user = await this.getUserById(id, requesterId, requesterRole);

    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }
    
    return userRepository.update(id, updateData);
  }

  async deleteUser(id: string, requesterId: string, requesterRole: UserRole) {
    const user = await this.getUserById(id, requesterId, requesterRole);
    return userRepository.delete(id);
  }
}

export const userService = new UserService();
