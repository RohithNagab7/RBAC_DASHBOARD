import { NextRequest } from "next/server";
import { authService } from "./auth.service";
import { successResponse, errorResponse } from "@/lib/response";
import { loginSchema } from "@/lib/validation";
import connectDB from "@/lib/db";

export class AuthController {
  async login(req: NextRequest) {
    try {
      const body = await req.json();
      
      const validation = loginSchema.safeParse(body);
      if (!validation.success) {
        return errorResponse("Validation error", 400, validation.error.format());
      }

      const { email, password } = validation.data;
      const result = await authService.login(email, password);

      const response = successResponse("Login successful", result);
      
      // Set HTTP-only cookie for server-side auth
      response.cookies.set("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    } catch (error: any) {
      return errorResponse(error.message || "Login failed", 401);
    }
  }
}

export const authController = new AuthController();
