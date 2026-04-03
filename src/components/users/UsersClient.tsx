"use client";

import React, { useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { UserRole } from "@/types";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { UserForm } from "./UserForm";
import { userService } from "@/services/user.service";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect } from "react";

interface UsersClientProps {
  initialUsers: any[];
}

export const UsersClient: React.FC<UsersClientProps> = ({ initialUsers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [state, setState] = useState({
    users: initialUsers,
    isModalOpen: false,
    editingUser: null as any,
    isLoading: false,
    error: "",
    page: 1,
    limit: 6,
    total: 0,
  });

  const { users, isModalOpen, editingUser, isLoading, error, page, limit } = state;

  const refreshUsers = async (currentPage = page, search = debouncedSearch) => {
    try {
      const data = await userService.getAllUsers({ 
        page: currentPage, 
        limit: limit,
        search: search 
      });
      setState((prev) => ({ 
        ...prev, 
        users: data.users || [],
        total: data.total || 0,
        page: currentPage
      }));
    } catch (err) {
      // Data refresh failed
    }
  };

  useEffect(() => {
    refreshUsers(1, debouncedSearch);
  }, [debouncedSearch]);

  const handleCreate = async (data: any) => {
    setState((prev) => ({ ...prev, isLoading: true, error: "" }));
    try {
      await userService.createUser(data);
      await refreshUsers();
      setState((prev) => ({ ...prev, isModalOpen: false }));
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        error: err.response?.data?.message || "Failed to create user",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleUpdate = async (data: any) => {
    setState((prev) => ({ ...prev, isLoading: true, error: "" }));
    try {
      await userService.updateUser(editingUser._id, data);
      await refreshUsers();
      setState((prev) => ({ ...prev, isModalOpen: false, editingUser: null }));
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        error: err.response?.data?.message || "Failed to update user",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete user "${name}"?`)) return;

    try {
      await userService.deleteUser(id);
      await refreshUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const openCreateModal = () => {
    setState((prev) => ({
      ...prev,
      editingUser: null,
      error: "",
      isModalOpen: true,
    }));
  };

  const openEditModal = (user: any) => {
    setState((prev) => ({
      ...prev,
      editingUser: user,
      error: "",
      isModalOpen: true,
    }));
  };

  return (
    <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Users Management</h1>
            <p className="mt-2 text-slate-400">Manage client and team user accounts.</p>
          </div>
          <Button onClick={openCreateModal}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add User
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-md">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-12 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card key={user._id} className="hover:border-slate-700 transition-colors group">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-800 text-slate-400 border border-slate-700">
                    User
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {user.name}
                </h3>
                <p className="text-slate-400 text-sm mt-1">{user.email}</p>
                <p className="text-slate-500 text-xs mt-4 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {user.phone || "No phone added"}
                </p>
                
                <div className="mt-8 flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 rounded-xl"
                    onClick={() => openEditModal(user)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    className="flex-1 rounded-xl"
                    onClick={() => handleDelete(user._id, user.name)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
            <p className="text-slate-500">No users found.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {users.length > 0 && (
          <div className="mt-8 flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshUsers(page - 1)}
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
              onClick={() => refreshUsers(page + 1)}
              disabled={users.length < limit}
            >
              Next
            </Button>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setState((prev) => ({ ...prev, isModalOpen: false }))}
          title={editingUser ? "Edit User" : "Create New User"}
        >
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg text-center">
              {error}
            </div>
          )}
          <UserForm
            initialData={editingUser}
            onSubmit={editingUser ? handleUpdate : handleCreate}
            isLoading={isLoading}
          />
        </Modal>
      </div>
    </RoleGuard>
  );
};
