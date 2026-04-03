"use client";

import React, { useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { UserRole } from "@/types";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TaskForm } from "./TaskForm";
import { taskService } from "@/services/task.service";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect } from "react";

interface TasksClientProps {
  initialTasks: any[];
}

export const TasksClient: React.FC<TasksClientProps> = ({ initialTasks }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [state, setState] = useState({
    tasks: initialTasks,
    isModalOpen: false,
    editingTask: null as any,
    isLoading: false,
    error: "",
    page: 1,
    limit: 6,
    total: 0,
  });

  const { tasks, isModalOpen, editingTask, isLoading, error, page, limit } = state;

  const refreshTasks = async (currentPage = page, search = debouncedSearch) => {
    try {
      const data = await taskService.getAllTasks({ 
        page: currentPage, 
        limit: limit,
        search: search 
      });
      setState((prev) => ({ 
        ...prev, 
        tasks: data.tasks || [],
        total: data.total || 0,
        page: currentPage
      }));
    } catch (err) {
      // Data refresh failed
    }
  };

  useEffect(() => {
    refreshTasks(1, debouncedSearch);
  }, [debouncedSearch]);

  const handleCreate = async (data: any) => {
    setState((prev) => ({ ...prev, isLoading: true, error: "" }));
    try {
      await taskService.createTask(data);
      await refreshTasks();
      setState((prev) => ({ ...prev, isModalOpen: false }));
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        error: err.response?.data?.message || "Failed to create task",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleUpdate = async (data: any) => {
    setState((prev) => ({ ...prev, isLoading: true, error: "" }));
    try {
      await taskService.updateTask(editingTask._id, data);
      await refreshTasks();
      setState((prev) => ({ ...prev, isModalOpen: false, editingTask: null }));
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        error: err.response?.data?.message || "Failed to update task",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete task "${title}"?`)) return;

    try {
      await taskService.deleteTask(id);
      await refreshTasks();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete task");
    }
  };

  const openCreateModal = () => {
    setState((prev) => ({
      ...prev,
      editingTask: null,
      error: "",
      isModalOpen: true,
    }));
  };

  const openEditModal = (task: any) => {
    setState((prev) => ({
      ...prev,
      editingTask: task,
      error: "",
      isModalOpen: true,
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "medium": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "low": return "text-green-400 bg-green-400/10 border-green-400/20";
      default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  return (
    <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER]}>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Personal Tasks</h1>
            <p className="mt-2 text-slate-400">Track and manage your daily activities.</p>
          </div>
          <Button onClick={openCreateModal}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Task
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-md">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-12 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task._id} className="hover:border-slate-700 transition-colors group relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1.5 ${
                task.priority === 'high' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 
                task.priority === 'medium' ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]'
              }`} />
              
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${getPriorityColor(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                    task.status === 'completed' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-slate-400 bg-slate-400/10 border-slate-400/20'
                  }`}>
                    {task.status}
                  </span>
                </div>

                <h3 className={`text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                  {task.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-8 h-10">
                  {task.description || "No description provided."}
                </p>
                
                <div className="flex gap-3 mt-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 rounded-xl"
                    onClick={() => openEditModal(task)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    className="flex-1 rounded-xl"
                    onClick={() => handleDelete(task._id, task.title)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
            <p className="text-slate-500">No tasks found. Time to add one!</p>
          </div>
        )}

        {/* Pagination Controls */}
        {tasks.length > 0 && (
          <div className="mt-8 flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshTasks(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-slate-400 text-sm">
              Page {page}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshTasks(page + 1)}
              disabled={tasks.length < limit}
            >
              Next
            </Button>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setState((prev) => ({ ...prev, isModalOpen: false }))}
          title={editingTask ? "Edit Task" : "Create New Task"}
        >
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg text-center">
              {error}
            </div>
          )}
          <TaskForm
            initialData={editingTask}
            onSubmit={editingTask ? handleUpdate : handleCreate}
            isLoading={isLoading}
          />
        </Modal>
      </div>
    </RoleGuard>
  );
};
