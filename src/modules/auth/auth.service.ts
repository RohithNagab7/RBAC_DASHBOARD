import { userRepository } from "@/repositories/user.repository";
import { comparePassword } from "@/lib/bcrypt";
import { signToken } from "@/lib/jwt";
import { UserRole } from "@/types";

export class AuthService {
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email, true);

    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = signToken({
      userId: user._id,
      role: user.role,
      email: user.email,
    });

    const { password: _, ...userWithoutPassword } = user as any;

    return {
      token,
      user: userWithoutPassword,
    };
  }
}

export const authService = new AuthService();
