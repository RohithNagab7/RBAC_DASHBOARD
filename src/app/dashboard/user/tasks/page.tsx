import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TasksClient } from "@/components/tasks/TasksClient";
import { taskService } from "@/services/task.service";
import api from "@/lib/api";

export default async function TasksPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  // Set the token for the server-side axios call
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
  try {
    // Fetch initial tasks on the server using the universal service
    const tasksData = await taskService.getAllTasks({ limit: 100 });
    const initialTasks = tasksData.tasks || [];

    return <TasksClient initialTasks={initialTasks} />;
  } catch (error) {
    console.error("Failed to fetch tasks on server:", error);
    if ((error as any).response?.status === 401) {
      redirect("/login");
    }
    return <TasksClient initialTasks={[]} />;
  }
}
