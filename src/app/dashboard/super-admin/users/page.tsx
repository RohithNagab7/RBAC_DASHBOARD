import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UsersClient } from "@/components/users/UsersClient";
import { userService } from "@/services/user.service";
import api from "@/lib/api";

export default async function SuperAdminUsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  // Set the token for the server-side axios call
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
  try {
    // For Super Admin, the backend already handles returning ALL users
    const usersData = await userService.getAllUsers({ limit: 100 });
    const initialUsers = usersData.users || [];

    return (
      <div className="py-8">
        <UsersClient initialUsers={initialUsers} />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch users on server:", error);
    if ((error as any).response?.status === 401) {
      redirect("/login");
    }
    return <UsersClient initialUsers={[]} />;
  }
}
