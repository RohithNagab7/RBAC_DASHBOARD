import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UsersClient } from "@/components/users/UsersClient";
import { userService } from "@/services/user.service";
import api from "@/lib/api";

export default async function UsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  // Set the token for the server-side axios call
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
  try {
    // Fetch initial users on the server using the universal service
    const usersData = await userService.getAllUsers({ limit: 100 });
    const initialUsers = usersData.users || [];

    return <UsersClient initialUsers={initialUsers} />;
  } catch (error) {
    console.error("Failed to fetch users on server:", error);
    if ((error as any).response?.status === 401) {
      redirect("/login");
    }
    return <UsersClient initialUsers={[]} />;
  }
}
