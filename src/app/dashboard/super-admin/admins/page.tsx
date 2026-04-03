import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminsClient } from "@/components/admins/AdminsClient";
import { adminService } from "@/services/admin.service";
import api from "@/lib/api";

export default async function AdminsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  // Set the token for the server-side API call
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
  try {
    const admins = await adminService.getAllAdmins({ limit: 100 });
    const initialAdmins = admins.users || [];

    return <AdminsClient initialAdmins={initialAdmins} />;
  } catch (error) {
    console.error("Failed to fetch admins on server:", error);
    if ((error as any).response?.status === 401) {
      redirect("/login");
    }
    return <AdminsClient initialAdmins={[]} />;
  }
}
